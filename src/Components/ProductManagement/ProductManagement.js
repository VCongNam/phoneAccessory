import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Row,
} from "antd";
import { supabase } from "../supabaseClient";
import "./ProductManagement.css";

const { Option } = Select;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isAddBrandModalVisible, setIsAddBrandModalVisible] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.error(error);
        return;
      }
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase.from("brand").select("*");
      if (error) {
        console.error("Error fetching brands:", error);
        return;
      }
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Thêm sản phẩm mới
  const addProduct = async (values) => {
    try {
      const { data, error } = await supabase.from("products").insert([
        {
          name: values.name,
          des: values.des,
          sell_price: values.sell_price,
          stock_quantity: values.stock_quantity,
          import_price: values.import_price,
          img: values.img,
          cate_id: values.cate_id,
          brand_id: values.brand_id,
        },
      ]);
      if (!error) {
        message.success("Product added successfully!");
        fetchProducts();
        setIsModalVisible(false);
      } else {
        message.error("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Xóa sản phẩm sau khi xác nhận
  const confirmDeleteProduct = async () => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("product_id", productToDelete.product_id);
      if (!error) {
        message.success("Product deleted successfully!");
        fetchProducts();
      } else {
        message.error("Failed to delete product.");
      }
      setDeleteModalVisible(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Mở modal cảnh báo xóa sản phẩm
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  // Chỉnh sửa sản phẩm
  const editProduct = async (product_id, values) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: values.name,
          des: values.des,
          sell_price: values.sell_price,
          stock_quantity: values.stock_quantity,
          import_price: values.import_price,
          img: values.img,
          cate_id: values.cate_id,
          brand_id: values.brand_id,
        })
        .eq("product_id", product_id);

      if (!error) {
        message.success("Product updated successfully!");
        fetchProducts();
        setEditingProduct(null);
      } else {
        message.error("Failed to update product.");
      }
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };
  const handleAddBrand = async () => {
    try {
      const { error } = await supabase
        .from("brand")
        .insert([{ name: newBrandName }]);
      if (error) {
        message.error("Failed to add brand.");
        console.error("Error adding brand:", error);
      } else {
        message.success("Thêm nhãn hiệu thành công!");
        setNewBrandName("");
        setIsAddBrandModalVisible(false);
        fetchBrands(); // Re-fetch brands to update the table
      }
    } catch (error) {
      console.error("Error adding brand:", error);
      message.error("Failed to add brand.");
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    try {
      const { error } = await supabase
        .from("categories")
        .insert([{ name: newCategoryName }]);
      if (error) {
        message.error("Failed to add category.");
        console.error("Error adding category:", error);
      } else {
        message.success("Thêm thể loại thành công!");
        setNewCategoryName("");
        setIsAddCategoryModalVisible(false);
        fetchCategories(); // Re-fetch categories to update the table
      }
    } catch (error) {
      console.error("Error adding category:", error);
      message.error("Failed to add category.");
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "des",
      key: "des",
    },
    {
      title: "Giá nhập",
      dataIndex: "import_price",
      key: "import_price",
    },
    {
      title: "Giá bán",
      dataIndex: "sell_price",
      key: "sell_price",
    },
    {
      title: "Số lượng",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
    },

    {
      title: "Ảnh",
      dataIndex: "img",
      key: "img",
      render: (img) =>
        img ? <img src={img} alt="Product" width="50" /> : "Trống",
    },
    {
      title: "Thể loại",
      dataIndex: "cate_id",
      key: "cate_id",
      render: (cate_id) =>
        categories.find((cat) => cat.id === cate_id)?.name || "Trống",
    },
    {
      title: "Nhãn hiệu",
      dataIndex: "brand_id",
      key: "brand_id",
      render: (brand_id) =>
        brands.find((brand) => brand.brand_id === brand_id)?.name || "Trống",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => setEditingProduct(record)}>Sửa</Button>
          <Button onClick={() => handleDeleteProduct(record)} danger>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="product-table">
      <h2>Thông tin sản phẩm</h2>
      <Row className="my-3">
      <Button  type="primary" onClick={() => setIsModalVisible(true)}>
        Thêm sản phẩm
      </Button>
      <Button type="primary" onClick={() => setIsAddBrandModalVisible(true)}>
        Thêm nhãn hiệu
      </Button>
      <Button type="primary" onClick={() => setIsAddCategoryModalVisible(true)}>
        Thêm thể loại
      </Button>
      </Row>

      {/* Add Brand Modal */}
      <Modal
        title="Thêm nhãn hiệu mới"
        open={isAddBrandModalVisible}
        onCancel={() => setIsAddBrandModalVisible(false)}
        onOk={handleAddBrand}
      >
        <Form>
          <Form.Item label="Tên nhãn hiệu">
            <Input
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        title="Thêm thể loại mới"
        open={isAddCategoryModalVisible}
        onCancel={() => setIsAddCategoryModalVisible(false)}
        onOk={handleAddCategory}
      >
        <Form>
          <Form.Item label="Tên thể loại">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="product_id"
      />

      <Modal
        title="Thêm sản phẩm"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={addProduct}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="des">
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá nhập"
            name="import_price"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Giá bán"
            name="sell_price"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Số luợng" name="stock_quantity">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Image URL" name="img">
            <Input />
          </Form.Item>
          <Form.Item
            label="Thể loại"
            name="cate_id"
            rules={[{ required: true }]}
          >
            <Select placeholder="Thể loại">
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nhãn hiệu"
            name="brand_id"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn nhãn hiệu">
              {brands.map((brand) => (
                <Option key={brand.brand_id} value={brand.brand_id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm sản phẩm
          </Button>
        </Form>
      </Modal>

      {editingProduct && (
        <Modal
          title="Chỉnh sửa thông tin sản phẩm"
          open={!!editingProduct}
          onCancel={() => setEditingProduct(null)}
          footer={null}
        >
          <Form
            initialValues={editingProduct}
            onFinish={(values) =>
              editProduct(editingProduct.product_id, values)
            }
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="des">
              <Input />
            </Form.Item>
            <Form.Item
              label="Giá nhập"
              name="import_price"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Giá bán"
              name="sell_price"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Số luợng" name="stock_quantity">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Image URL" name="img">
              <Input />
            </Form.Item>
            <Form.Item
              label="Thể loại"
              name="cate_id"
              rules={[{ required: true }]}
            >
              <Select placeholder="Thể loại">
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Nhãn hiệu"
              name="brand_id"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn nhãn hiệu">
                {brands.map((brand) => (
                  <Option key={brand.brand_id} value={brand.brand_id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhập thông tin
            </Button>
          </Form>
        </Modal>
      )}

      <Modal
        title="Xóa sản phẩm"
        open={deleteModalVisible}
        onOk={confirmDeleteProduct}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>Bạn có muốn xóa sản phẩm này?</p>
      </Modal>
    </div>
  );
};

export default ProductTable;
