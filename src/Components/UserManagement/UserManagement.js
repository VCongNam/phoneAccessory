import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Table,
  Button,
  Input,
  Form,
  Modal,
  message,
  Popconfirm,
  Space,
  InputNumber,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchRoles();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      // Fetch accounts and join with the role table to get role names
      const { data, error } = await supabase
        .from("account")
        .select(`*, role (*)`); // Remove .single() 
  
      if (error) throw error;
  
      // Handle cases with multiple rows or no rows
      if (data) {
        setAccounts(data); 
      } else {
        setAccounts([]); // Set an empty array if no accounts are found
      }
  
    } catch (error) {
      message.error("Error fetching accounts: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase.from("role").select("*");
      if (error) throw error;
      setRoles(data);
    } catch (error) {
      message.error("Error fetching roles: " + error.message);
    }
  };

  const handleCreateAccount = async (values) => {
    try {
      // Ensure role_id is a number
      const formattedValues = {
        ...values,
        role_id: Number(values.role_id),
      };

      const { data, error } = await supabase
        .from("account")
        .insert([formattedValues])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setAccounts((prevAccounts) => [...prevAccounts, data[0]]);
        toast.success("Tạo tài khoản thành công!");
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      message.error("Error creating account: " + error.message);
    }
  };

  const handleUpdateAccount = async (values) => {
    try {
      // Ensure role_id is a number
      const formattedValues = {
        ...values,
        role_id: Number(values.role_id),
      };

      const { error } = await supabase
        .from("account")
        .update(formattedValues)
        .eq("user_id", formattedValues.user_id);

      if (error) throw error;

      toast.success("Cập nhập thành công!");
      setAccounts(
        accounts.map((account) =>
          account.user_id === formattedValues.user_id
            ? { ...account, ...formattedValues }
            : account
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      message.error("Error updating account: " + error.message);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      const { error } = await supabase
        .from("account")
        .delete()
        .eq("user_id", accountId);

      if (error) throw error;

      toast.success("Xóa thành công!");
      setAccounts(accounts.filter((account) => account.user_id !== accountId));
    } catch (error) {
      message.error("Error deleting account: " + error.message);
    }
  };

  const showModal = (record = null) => {
    setIsEditing(!!record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.submit();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (isEditing) {
      handleUpdateAccount(values);
    } else {
      handleCreateAccount(values);
    }
  };

  const columns = [
    { title: "Mã tài khoản", dataIndex: "user_id", key: "user_id" },
    {
      title: "Quyền",
      dataIndex: ["role", "role_name"], // Access role_name from the joined role data
      key: "role_name",
    },
    { title: "Tài khoản", dataIndex: "user_name", key: "user_name" },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      key: "password",
      render: () => "••••••••", // Mask the password
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa tài khoản này"
            onConfirm={() => handleDeleteAccount(record.user_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2>Quản lý tài khoản</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: "16px" }}
      >
        Tạo tài khoản
      </Button>
      <Table
        columns={columns}
        dataSource={accounts}
        loading={loading}
        rowKey="user_id"
      />
      <Modal
        title={isEditing ? "Edit Account" : "Create New Account"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          {isEditing && (
            <Form.Item name="user_id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item
            name="user_name"
            label="User Name"
            rules={[{ required: true, message: "Please input the user name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input the password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role_id"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select>
              {roles.map((role) => (
                <Select.Option key={role.role_id} value={role.role_id}>
                  {role.role_name}{" "}
                  {/* Assuming your role table has a role_name column */}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;
