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
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Fetch vouchers from the database
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("voucher").select("*");
      if (error) throw error;
      setVouchers(data);
    } catch (error) {
      message.error("Error fetching vouchers: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle create voucher
  const handleCreateVoucher = async (values) => {
    try {
      const { data, error } = await supabase.from("voucher").insert([values]).select();
      if (error) throw error;

      if (data && data.length > 0) {
        setVouchers((prevVouchers) => [...prevVouchers, data[0]]);
        toast.success("Tạo voucher thành công!");
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      message.error("Error creating voucher: " + error.message);
    }
  };

  // Handle update voucher
  const handleUpdateVoucher = async (values) => {
    try {
      const { error } = await supabase
        .from("voucher")
        .update(values)
        .eq("voucher_id", values.voucher_id);

      if (error) throw error;

      toast.success("Cập nhật voucher thành công!");
      setVouchers(
        vouchers.map((voucher) =>
          voucher.voucher_id === values.voucher_id ? { ...voucher, ...values } : voucher
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      message.error("Error updating voucher: " + error.message);
    }
  };

  // Handle delete voucher
  const handleDeleteVoucher = async (voucherId) => {
    try {
      const { error } = await supabase.from("voucher").delete().eq("voucher_id", voucherId);
      if (error) throw error;

      toast.success("Xóa voucher thành công!");
      setVouchers(vouchers.filter((voucher) => voucher.voucher_id !== voucherId));
    } catch (error) {
      message.error("Error deleting voucher: " + error.message);
    }
  };

  // Modal form handler
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
      handleUpdateVoucher(values);
    } else {
      handleCreateVoucher(values);
    }
  };

  const columns = [
    { title: "Mã Voucher", dataIndex: "voucher_code", key: "voucher_code" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Số tiền giảm",
      dataIndex: "discount_amount",
      key: "discount_amount",
      render: (amount) => `${amount} VND`,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiry_date",
      key: "expiry_date",
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
            title="Bạn có chắc muốn xóa voucher này?"
            onConfirm={() => handleDeleteVoucher(record.voucher_id)}
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
      <h2>Quản lý Voucher</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: "16px" }}
      >
        Tạo Voucher
      </Button>
      <Table columns={columns} dataSource={vouchers} loading={loading} rowKey="voucher_id" />
      <Modal
        title={isEditing ? "Sửa Voucher" : "Tạo Voucher Mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          {isEditing && (
            <Form.Item name="voucher_id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item
            name="voucher_code"
            label="Mã Voucher"
            rules={[{ required: true, message: "Hãy nhập mã voucher!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Hãy nhập mô tả cho voucher!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discount_amount"
            label="Số tiền giảm"
            rules={[{ required: true, message: "Hãy nhập số tiền giảm!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="expiry_date"
            label="Ngày hết hạn"
            rules={[{ required: true, message: "Hãy nhập ngày hết hạn!" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManagement;
