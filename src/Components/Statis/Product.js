import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { Bar } from 'react-chartjs-2';
import { supabase } from "../supabaseClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
// Kết nối đến Supabase


const ProductStat = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // Lấy dữ liệu sản phẩm từ Supabase
  useEffect(() => {
    const fetchProducts = async () => {
        const { data, error, count } = await supabase
          .from('products')
          .select('product_code, name, stock_quantity', { count: 'exact' }) // Include count: 'exact' here
          .order('stock_quantity', { ascending: false });
      
        if (error) {
          console.error('Lỗi khi lấy dữ liệu từ Supabase:', error);
        } else {
          setProducts(data);
          setTotalProducts(count); // Set the total count from the response
        }
      };
      

    fetchProducts();
  }, []);

  // Cấu hình dữ liệu cho biểu đồ Bar Chart
  const chartData = {
    labels: products.map((product) =>  product.product_code),
    datasets: [
      {
        label: 'Số lượng tồn kho',
        data: products.map((product) => product.stock_quantity),
        backgroundColor: 'rgba(54, 12, 45, 0.6)',
        borderColor: 'rgba(54, 162, 235, 2)',
        borderWidth: 1,
      },
    ],
  };

  // Cột cho bảng từ dữ liệu Supabase
  const columns = [
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Số Lượng Tồn Kho',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
      sorter: (a, b) => a.stock_quantity - b.stock_quantity,
    },
  ];

  // Xử lý khi có sự thay đổi trong bảng
  const onTableChange = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
  };

  return (
    <div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Số Lượng Tồn Kho Sản Phẩm</h3>
         <div style={{ marginBottom: '20px', fontSize: '1.5em', fontWeight: 'bold' }}>
        TỔNG SỐ SẢN PHẨM: <span style={{ color: 'red' }}>{totalProducts} </span>sản phẩm
         </div>     
         <Table
          dataSource={products}
          columns={columns}
          rowKey="name"
          onChange={onTableChange}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Biểu Đồ Tồn Kho Sản Phẩm</h3>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
      
      
    </div>
  );
};

export default ProductStat;

