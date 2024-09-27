import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  message,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import { supabase } from "../supabaseClient"; // Đảm bảo bạn đã thiết lập Supabase client

const { Option } = Select;

const ProductManagement = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // Lấy danh sách categories từ Supabase
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select();
    if (error) {
      message.error("Lỗi khi tải danh mục sản phẩm");
    } else {
      setCategories(data);
    }
  };

  // Lấy danh sách brands từ Supabase
  const fetchBrands = async () => {
    const { data, error } = await supabase.from("brand").select();
    if (error) {
      message.error("Lỗi khi tải thương hiệu sản phẩm");
    } else {
      setBrands(data);
    }
  };

  // Xử lý submit form để tạo hoặc cập nhật sản phẩm
  const handleSubmit = async (values) => {
    setLoading(true);
    const {
      product_id,
      name,
      des,
      sell_price,
      import_price,
      stock_quantity,
      cate_id,
      brand_id,
    } = values;

    const productData = {
      name,
      des,
      sell_price,
      stock_quantity,
      cate_id,
      brand_id,
    };

    // Nếu có product_id thì cập nhật, không thì tạo mới
    let result;
    if (product_id) {
      result = await supabase
        .from("products")
        .update(productData)
        .eq("product_id", product_id);
    } else {
      result = await supabase.from("products").insert([productData]);
    }

    const { error } = result;
    if (error) {
      message.error("Lỗi khi lưu sản phẩm");
    } else {
      message.success(
        product_id
          ? "Cập nhật sản phẩm thành công"
          : "Thêm sản phẩm mới thành công"
      );
      form.resetFields(); // Reset form sau khi lưu thành công
    }

    setLoading(false);
  };

  return (
    <Card title="Quản lý sản phẩm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Row gutter={16}>
          {" "}
          {/* Sử dụng Row và Col để tạo layout 2 cột */}
          <Col span={12}>
            <Form.Item label="ID sản phẩm (Nếu cần cập nhật)" name="product_id">
              <Input placeholder="Nhập ID sản phẩm (để cập nhật)" />
            </Form.Item>
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
            <Form.Item
              label="Mô   
 tả sản phẩm"
              name="des"
            >
              <Input.TextArea placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giá bán"
              name="sell_price"
              rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập giá bán"
              />
            </Form.Item>
            <Form.Item
              label="Giá mua"
              name="import_price"
              rules={[{ required: true, message: "Vui lòng nhập giá mua" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập giá mua"
              />
            </Form.Item>
            <Form.Item
              label="Số lượng tồn kho"
              name="stock_quantity"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng tồn kho" },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập số lượng tồn kho"
              />
            </Form.Item>
            <Form.Item
              label="Danh mục"
              name="cate_id"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select placeholder="Chọn danh mục sản phẩm">
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Thương hiệu"
              name="brand_id"
              rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
            >
              <Select placeholder="Chọn thương hiệu sản phẩm">
                {brands.map((brand) => (
                  <Option key={brand.brand_id} value={brand.brand_id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider /> {/* Thêm đường phân cách */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {form.getFieldValue("product_id")
              ? "Cập nhật sản phẩm"
              : "Thêm sản phẩm"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductManagement;
