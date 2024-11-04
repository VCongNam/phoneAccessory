// SalesStatistics.js
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { supabase } from "../supabaseClient";
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const SalesStatistics = () => {
  const [dailyStats, setDailyStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, created_at, total_price');
      const { data: orderItems, error: orderItemsError } = await supabase
        .from('order_items')
        .select('order_id, product_id, quantity');
      
      if (ordersError || orderItemsError) {
        console.error('Lỗi khi lấy dữ liệu từ Supabase:', ordersError || orderItemsError);
        return;
      }

      const stats = {};
      let totalRev = 0;

      orders.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('vi-VN');
        if (!stats[date]) {
          stats[date] = { orderCount: 0, revenue: 0, productsSold: 0 };
        }
        stats[date].orderCount += 1;
        stats[date].revenue += order.total_price;
        totalRev += order.total_price; // Accumulate total revenue
      });

      orderItems.forEach(item => {
        const order = orders.find(o => o.id === item.order_id);
        if (order) {
          const date = new Date(order.created_at).toLocaleDateString('vi-VN');
          stats[date].productsSold += item.quantity;
        }
      });

      const dailyStatsArray = Object.entries(stats).map(([date, data]) => ({
        date,
        ...data
      }));
      
      setDailyStats(dailyStatsArray);
      setTotalRevenue(totalRev); // Set total revenue
    };

    fetchSalesData();
  }, []);

  const chartData = {
    labels: dailyStats.map(stat => stat.date),
    datasets: [
      {
        type: 'line',
        label: 'Doanh thu (₫)',
        data: dailyStats.map(stat => stat.revenue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        yAxisID: 'y',
        tension: 0.3,
      },
      {
        type: 'bar',
        label: 'Số lượng sản phẩm đã bán',
        data: dailyStats.map(stat => stat.productsSold),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Doanh thu (₫)' },
        ticks: {
          callback: (value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Số lượng sản phẩm đã bán' },
        grid: { drawOnChartArea: false },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Doanh thu (₫)') {
              return `${context.dataset.label}: ${context.raw.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
            }
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Số lượng đơn hàng',
      dataIndex: 'orderCount',
      key: 'orderCount',
    },
    {
      title: 'Doanh thu (₫)',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: 'Số lượng sản phẩm đã bán',
      dataIndex: 'productsSold',
      key: 'productsSold',
    },
  ];

  return (
    <div>
      <h3>Thống Kê Bán Hàng Theo Ngày</h3>

      <div style={{ marginBottom: '20px', fontSize: '1.5em', fontWeight: 'bold' }}>
        Tổng Doanh Thu: <span style={{ color: 'red' }}>{totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
      </div>

      <Table dataSource={dailyStats} columns={columns} rowKey="date" />
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
};

export default SalesStatistics;
