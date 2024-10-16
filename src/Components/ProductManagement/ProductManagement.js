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
  Space,
  Badge,
  List,
} from "antd";
import { supabase } from "../supabaseClient";
import "./ProductManagement.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BellOutlined } from "@ant-design/icons";

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
  const [isNotificationModalVisible, setIsNotificationModalVisible] =
    useState(false);
  const [under10, setUnder10] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [selectedCategory, selectedBrand]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from("products").select("*");

      // Apply category filter
      if (selectedCategory) {
        query = query.eq("cate_id", selectedCategory);
      }

      // Apply brand filter
      if (selectedBrand) {
        query = query.eq("brand_id", selectedBrand);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data);

      const lowStockProducts = data.filter(
        (product) => product.stock_quantity < 10
      );
      lowStockProducts.forEach((product) => {
        toast.warn(`Sản phẩm "${product.name}" sắp hết hàng!`);
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải dữ liệu sản phẩm");
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải dữ liệu thể loại");
    }
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase.from("brand").select("*");
      if (error) throw error;
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Không thể tải dữ liệu nhãn hiệu");
    }
  };

  const addProduct = async (values) => {
    try {
      const productCode = await generateProductCode(values.cate_id, values.brand_id);

      const newProduct = {
        ...values,
        product_code: productCode
      };

      const { error } = await supabase.from("products").insert([newProduct]);
      if (error) throw error;
      toast.success("Thêm sản phẩm thành công!");
      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Không thể thêm sản phẩm");
    }
  };
  const generateProductCode = async (categoryId, brandId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const brand = brands.find(b => b.brand_id === brandId);
    const productCount = await getProductCount();

    // Sử dụng mã viết tắt cho thể loại
    const categoryCode = getCategoryCode(category.name);
    const brandCode = brand.name.substring(0, 3).toUpperCase();

    return `${categoryCode}-${brandCode}-${String(productCount + 1).padStart(4, '0')}`;
  };

  // Hàm để lấy mã viết tắt cho thể loại
  const getCategoryCode = (categoryName) => {
    const categoryCodeMap = {
      'Ốp lưng': 'OP',
      'Củ sạc': 'CS',
      'Cáp sạc': 'DS',
      'Tai nghe': 'TN',
      'Sạc dự phòng pin': 'SDP',
      'Giá đỡ điện thoại': 'GDT',
      'Loa bluetooth' : 'LB'
      // Thêm các thể loại khác tại đây
    };
    return categoryCodeMap[categoryName] || categoryName.substring(0, 2).toUpperCase();
  };
  // Hàm để lấy số lượng sản phẩm hiện tại
  const getProductCount = async () => {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting product count:', error);
      return 0;
    }

    return count || 0;
  };

  const confirmDeleteProduct = async () => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("product_id", productToDelete.product_id);
      if (error) throw error;
      toast.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Không thể xóa sản phẩm");
    }
    setDeleteModalVisible(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  const editProduct = async (product_id, values) => {
    try {
      // Tạo mã sản phẩm mới nếu thể loại hoặc nhãn hiệu thay đổi
      const currentProduct = products.find(p => p.product_id === product_id);
      let newProductCode = currentProduct.product_code;

      if (currentProduct.cate_id !== values.cate_id || currentProduct.brand_id !== values.brand_id) {
        newProductCode = await generateProductCode(values.cate_id, values.brand_id);
      }

      const updateValues = {
        ...values,
        product_code: newProductCode
      };

      const { error } = await supabase
        .from("products")
        .update(updateValues)
        .eq("product_id", product_id);
      if (error) throw error;
      toast.success("Sửa thông tin sản phẩm thành công!");
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error("Error editing product:", error);
      toast.error("Không thể sửa thông tin sản phẩm");
    }
  };
  const handleAddBrand = async () => {
    try {
      const { error } = await supabase
        .from("brand")
        .insert([{ name: newBrandName }]);
      if (error) throw error;
      toast.success("Thêm nhãn hiệu thành công!");
      setNewBrandName("");
      setIsAddBrandModalVisible(false);
      fetchBrands();
    } catch (error) {
      console.error("Error adding brand:", error);
      toast.error("Không thể thêm nhãn hiệu");
    }
  };

  const handleAddCategory = async () => {
    try {
      const { error } = await supabase
        .from("categories")
        .insert([{ name: newCategoryName }]);
      if (error) throw error;
      toast.success("Thêm thể loại thành công!");
      setNewCategoryName("");
      setIsAddCategoryModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Không thể thêm thể loại");
    }
  };

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "Mã sản phẩm",
      dataIndex: "product_code",
      key: "product_code",
    },
    { title: "Giá nhập", dataIndex: "import_price", key: "import_price" },
    { title: "Giá bán", dataIndex: "sell_price", key: "sell_price" },
    { title: "Số lượng", dataIndex: "stock_quantity", key: "stock_quantity" },
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
        <Space>
          <Button onClick={() => setEditingProduct(record)}>Sửa</Button>
          <Button onClick={() => handleDeleteProduct(record)} danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-table">
      <h1>Quản lí sản phẩm</h1>
      <Space>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Thêm sản phẩm
        </Button>
        <Button onClick={() => setIsAddBrandModalVisible(true)}>
          Thêm nhãn hiệu
        </Button>
        <Button onClick={() => setIsAddCategoryModalVisible(true)}>
          Thêm thể loại
        </Button>
        <Button
          onClick={() => {
            setIsNotificationModalVisible(true);
            const under10 = products.filter(
              (product) => product.stock_quantity < 10
            );
            setUnder10(under10);
          }}
        >
          <Badge count={under10.length} offset={[10, 0]}>
            <BellOutlined style={{ fontSize: "18px" }} />
          </Badge>
        </Button>
      </Space>
      <Space>
        <Select
          placeholder="Lọc theo thể loại"
          onChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
          allowClear
        >
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Lọc theo nhãn hiệu"
          onChange={(value) => setSelectedBrand(value)}
          value={selectedBrand}
          allowClear
        >
          {brands.map((brand) => (
            <Option key={brand.brand_id} value={brand.brand_id}>
              {brand.name}
            </Option>
          ))}
        </Select>
      </Space>
      <Table className="my-3"
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="product_id"
        pagination={{
          pageSize: 10 // Hiển thị tổng số sản phẩm
        }}
      />

      <Modal
        title="Thêm sản phẩm"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={addProduct}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="product_code"
            label="Mã sản phẩm"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item name="des" label="Mô tả">
            <Input />
          </Form.Item>
          <Form.Item
            name="import_price"
            label="Giá nhập"
            rules={[{ required: true, message: "Nhập giá nhập" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="sell_price"
            label="Giá bán"
            rules={[{ required: true, message: "Nhập giá bán" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="stock_quantity"
            label="Số lượng"
            rules={[{ required: true, message: "Nhập số lượng" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="cate_id"
            label="Thể loại"
            rules={[{ required: true, message: "Chọn thể loại" }]}
          >
            <Select>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="brand_id"
            label="Nhãn hiệu"
            rules={[{ required: true, message: "Chọn nhãn hiệu" }]}
          >
            <Select>
              {brands.map((brand) => (
                <Option key={brand.brand_id} value={brand.brand_id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="img" label="Ảnh sản phẩm">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm sản phẩm
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa thông tin sản phẩm"
        visible={!!editingProduct}
        onCancel={() => setEditingProduct(null)}
        footer={null}
      >
        <Form
          initialValues={editingProduct}
          onFinish={(values) => editProduct(editingProduct.product_id, values)}
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="des" label="Mô tả">
            <Input />
          </Form.Item>
          <Form.Item
            name="import_price"
            label="Giá nhập"
            rules={[{ required: true, message: "Nhập giá nhập" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="sell_price"
            label="Giá bán"
            rules={[{ required: true, message: "Nhập giá bán" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="stock_quantity"
            label="Số lượng"
            rules={[{ required: true, message: "Nhập số lượng" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="cate_id"
            label="Thể loại"
            rules={[{ required: true, message: "Chọn thể loại" }]}
          >
            <Select>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="brand_id"
            label="Nhãn hiệu"
            rules={[{ required: true, message: "Chọn nhãn hiệu" }]}
          >
            <Select>
              {brands.map((brand) => (
                <Option key={brand.brand_id} value={brand.brand_id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="img" label="Ảnh sản phẩm">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật thông tin
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Xóa sản phẩm"
        visible={deleteModalVisible}
        onOk={confirmDeleteProduct}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
      </Modal>

      <Modal
        title="Thêm nhãn hiệu mới"
        visible={isAddBrandModalVisible}
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

      <Modal
        title="Thêm thể loại mới"
        visible={isAddCategoryModalVisible}
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

      <Modal
        title="Sản phẩm sắp hết hàng"
        visible={isNotificationModalVisible}
        onOk={() => setIsNotificationModalVisible(false)}
        onCancel={() => setIsNotificationModalVisible(false)}
      >
        <List
          itemLayout="horizontal"
          dataSource={under10}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`Số lượng: ${item.stock_quantity}`}
              />
            </List.Item>
          )}
        />
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ProductTable;
