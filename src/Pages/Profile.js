import React, { useState, useEffect } from "react";
import {
  Layout,
  Avatar,
  Card,
  Typography,
  Button,
  Form,
  Input,
  Table,
  Modal,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  LockOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";
import { useLocation } from "react-router-dom";
import AppHeader from "../Components/Header/Header";
import AppFooter from "../Components/Footer/Footer";
import { decoder64 } from "../Components/Base64Encoder/Base64Encoder";
const { Content } = Layout;
const { Title } = Typography;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

// Hàm để lấy và giải mã token
const getDecodedToken = () => {
  const token = getCookie("token");
  if (!token) return null;

  try {
    const decodedToken = decoder64(token);
    return JSON.parse(decodedToken);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const user = getDecodedToken();

  console.log("user:", user);
  const userId = user?.user_id;
  console.log("userId:", userId);
  const location = useLocation();

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchOrders();
    } else {
      console.error("Không tìm thấy ID người dùng trong localStorage");
      setLoading(false);
    }
  }, [userId]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profileuser")
      .select("name, email, phone, address")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Lỗi khi lấy thông tin hồ sơ: ", error);
    } else if (data) {
      const profileData = {
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      };
      setProfile(profileData);
      form.setFieldsValue(profileData);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        total_price,
        status,
        created_at,
        quantity,
        address_order,
        products (
          product_id,
          name
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi khi lấy lịch sử đơn hàng: ", error);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateProfile = async (values) => {
    const { error } = await supabase
      .from("profileuser")
      .update({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
      })
      .eq("user_id", userId);

    if (error) {
      message.error("Lỗi khi cập nhật hồ sơ");
    } else {
      message.success("Cập nhật hồ sơ thành công");
      setProfile(values);
      setIsEditing(false);
    }
  };

  const updatePassword = async (values) => {
    console.log("ojjj:", values);
    // Kiểm tra mật khẩu hiện tại
    const { data, error } = await supabase
      .from("account")
      .select("*")
      .eq("user_id", userId, "password", values.currentPassword)
      .single();
    console.log("data:", data);
    if (!data || error) {
      message.error("Mật khẩu hiện tại không chính xác");
      return;
    }
    // Cập nhật mật khẩu mới
    const { error: updateError, data: updateData } = await supabase
      .from("account")
      .update({ password: values.newPassword })
      .eq("user_id", userId);
    if (updateError) {
      console.error("Error updating password:", updateError);
      message.error("Lỗi khi cập nhật mật khẩu");
    } else {
      message.success("Cập nhật mật khẩu thành công");
      setIsPasswordModalVisible(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tổng giá",
      dataIndex: "total_price",
      key: "total_price",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content style={{ padding: "0 50px" }}>
          <Card
            style={{ marginTop: 24 }}
            cover={
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                  background: "#f0f2f5",
                }}
              >
                <Avatar size={64} icon={<UserOutlined />} />
              </div>
            }
            extra={
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </Button>
            }
          >
            <Form form={form} layout="vertical" onFinish={updateProfile}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  readOnly={isEditing}
                  disabled={profile.fullName !== "Placeholder Name"}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Vui lòng nhập email hợp lệ!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  readOnly={isEditing}
                  disabled={profile.email !== "placeholder@example.com"}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                readOnly={isEditing}
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^0\d{9}$/,
                    message:
                      "Số điện thoại không hợp lệ! Vui lòng nhập 10 chữ số bắt đầu bằng số 0.",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  readOnly={isEditing}
                  disabled={profile.phone && profile.phone.length === 10}
                />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ">
                <Input prefix={<HomeOutlined />} readOnly={isEditing} />
              </Form.Item>
              {isEditing && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: 8 }}
                  >
                    Cập nhật hồ sơ
                  </Button>
                </Form.Item>
              )}
            </Form>
            <Button onClick={() => setIsPasswordModalVisible(true)}>
              Đổi mật khẩu
            </Button>
          </Card>

          <Card style={{ marginTop: 24 }}>
            <Title level={4}>Lịch sử đơn hàng</Title>
            <Table columns={columns} dataSource={orders} rowKey="id" />
          </Card>
        </Content>
      </Layout>

      <Modal
        title="Đổi mật khẩu"
        visible={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={updatePassword}>
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              {
                min: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự!",
              },
              {
                pattern: /^(?=.*[A-Z])(?=.*\d).+$/,
                message:
                  "Mật khẩu phải chứa ít nhất một chữ hoa và một chữ số!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Hai mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <AppFooter />
    </Layout>
  );
}
