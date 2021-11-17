import React, { Component } from 'react'
import { Card, Button, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default class Category extends Component {
    render() {
        const title = '一级分类'
        const extra = (
            <Button type='primary'>
                <PlusOutlined />
                添加分类
            </Button>
        )
        const dataSource = [
            {
                key: '1',
                name: '胡彦斌',
                operation: 'a',
            },
            {
                key: '2',
                name: '胡彦祖',
                operation: 'b',
            },
        ];

        const columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                dataIndex: 'action',
                width: 350,
                render: () => (
                    <div>
                        <Button type='link'>修改分类</Button>
                        <Button type='link'>查看子分类</Button>
                        <Button type='link'>删除此分类</Button>
                    </div>
                )
            },
        ];
        return (
            <Card title={title} extra={extra}>
                <Table bordered dataSource={dataSource} columns={columns} />;
            </Card>
        )
    }
}
