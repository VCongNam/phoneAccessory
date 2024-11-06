import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Form, Input, Modal, notification, Space } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orderSummaries, setOrderSummaries] = useState([]);
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Lấy thông tin khách hàng với role_id = 1
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const { data: accounts, error: accountError } = await supabase
                .from('account')
                .select('user_id, user_name')
                .eq('role_id', 1);

            if (accountError) throw accountError;

            const userIds = accounts.map(account => account.user_id);

            const { data: profiles, error: profileError } = await supabase
                .from('profileuser')
                .select('*')
                .in('user_id', userIds);

            if (profileError) throw profileError;

            const { data: orders, error: orderError } = await supabase
                .from('orders')
                .select('id, user_id')
                .in('user_id', userIds);

            if (orderError) throw orderError;

            const profileMap = profiles.reduce((map, profile) => {
                map[profile.user_id] = profile;
                return map;
            }, {});

            const orderCountMap = orders.reduce((map, order) => {
                if (!map[order.user_id]) map[order.user_id] = 0;
                map[order.user_id] += 1;
                return map;
            }, {});

            const processedCustomers = accounts.map((account) => {
                const profile = profileMap[account.user_id] || {};
                return {
                    user_id: account.user_id,
                    username: account.user_name,
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    address: profile.address ? `${profile.address || ''}, ${profile.ward || ''}, ${profile.district || ''}, ${profile.city || ''}` : '',
                    total_orders: orderCountMap[account.user_id] || 0
                };
            });

            setCustomers(processedCustomers);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể lấy dữ liệu khách hàng'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditCustomer = (record) => {
        setSelectedCustomer(record);
        form.setFieldsValue({
            name: record.name,
            email: record.email,
            phone: record.phone,
            address: record.address
        });
        setDrawerVisible(true);
    };

    const handleSaveCustomer = async (values) => {
        try {
            const addressParts = values.address.split(',').map(part => part.trim());
            const [street, ward, district, city] = addressParts;

            const { error: profileError } = await supabase
                .from('profileuser')
                .update({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    address: street,
                    city: city,
                    district: district,
                    ward: ward
                })
                .eq('user_id', selectedCustomer.user_id);

            if (profileError) throw profileError;

            notification.success({
                message: 'Thành công',
                description: 'Cập nhật thông tin khách hàng thành công'
            });
            fetchCustomers();
            setDrawerVisible(false);
            setSelectedCustomer(null);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật thông tin khách hàng'
            });
        }
    };

    // Fetch order summaries for the selected customer
    const handleViewOrders = async (record) => {
        setLoading(true);
        try {
            // Lấy các đơn hàng của khách hàng
            const { data: orders, error: orderError } = await supabase
                .from('orders')
                .select('id, total_price, created_at, address_order, status')
                .eq('user_id', record.user_id);

            if (orderError) throw orderError;

            // Cập nhật dữ liệu đơn hàng và mở modal
            setOrderSummaries(orders);
            setModalVisible(true);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể lấy thông tin đơn hàng'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Cấu hình các cột trong bảng
    const columns = [
        { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
        { title: 'Số đơn hàng', dataIndex: 'total_orders', key: 'total_orders' },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditCustomer(record)}>
                        Sửa
                    </Button>
                    <Button type="default" icon={<EyeOutlined />} onClick={() => handleViewOrders(record)}>
                        Đơn hàng
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h1>Quản lý khách hàng</h1>
            <Table 
                columns={columns} 
                dataSource={customers} 
                rowKey="user_id" 
                loading={loading} 
                pagination={{ pageSize: 10 }} 
            />

            {/* Form chỉnh sửa thông tin khách hàng */}
            <Drawer
                title="Chỉnh sửa thông tin khách hàng"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                visible={isDrawerVisible}
                width={400}
            >
                <Form form={form} layout="vertical" onFinish={handleSaveCustomer}>
                    <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input.TextArea placeholder="Định dạng: Đường, Phường, Quận, Thành phố" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>Lưu thay đổi</Button>
                </Form>
            </Drawer>

            {/* Hiển thị thông tin đơn hàng */}
            <Modal
                title="Thông tin đơn hàng"
                visible={isModalVisible}
                onCancel={() => setModalVisible(false)}
                width={600}
                footer={null}
            >
                <Table 
                    columns={[
                        { title: 'ID Đơn hàng', dataIndex: 'id', key: 'id' },
                        { title: 'Tổng tiền', dataIndex: 'total_price', key: 'total_price', render: (price) => `${price.toLocaleString('vi-VN')} ₫` },
                        { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', render: (date) => new Date(date).toLocaleDateString('vi-VN') },
                        { title: 'Địa chỉ giao hàng', dataIndex: 'address_order', key: 'address_order', ellipsis: true },
                        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
                    ]}
                    dataSource={orderSummaries}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>
        </div>
    );
};

export default CustomerManager;

