import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
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


const Dashboard = () => {
  const [products, setProducts] = useState([]);

  // Lấy dữ liệu sản phẩm từ Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('product_code,name, stock_quantity');
      
      if (error) {
        console.error('Lỗi khi lấy dữ liệu từ Supabase:', error);
      } else {
        setProducts(data);
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
    },
    {
      title: 'Số Lượng Tồn Kho',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
    },
  ];

  // Dữ liệu giả
  const fakeData = [
    {
      key: '1',
      name: 'Sản phẩm A',
      stock_quantity: 50,
    },
    {
      key: '2',
      name: 'Sản phẩm B',
      stock_quantity: 20,
    },
    {
      key: '3',
      name: 'Sản phẩm C',
      stock_quantity: 35,
    },
    {
      key: '4',
      name: 'Sản phẩm D',
      stock_quantity: 80,
    },
    {
      key: '5',
      name: 'Sản phẩm E',
      stock_quantity: 15,
    },
  ];

  // Cột cho bảng dữ liệu giả
  const columnsFakeData = [
    {
      title: 'Tên Sản Phẩm (Giả)',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số Lượng Tồn Kho (Giả)',
      dataIndex: 'stock_quantity',
      key: 'stock_quantity',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard Quản Lý Shop</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Số Lượng Tồn Kho Sản Phẩm</h3>
        <Table dataSource={products} columns={columns} rowKey="name" />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Biểu Đồ Tồn Kho Sản Phẩm</h3>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Bảng Dữ Liệu Giả</h3>
        <Table dataSource={fakeData} columns={columnsFakeData} />
      </div>
    </div>
  );
};

export default Dashboard;
