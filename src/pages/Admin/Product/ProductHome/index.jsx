import React, { Component } from 'react'
import {Card, Select, Input, Button, Table }from 'antd';
import {PlusOutlined }from '@ant-design/icons'

const {Option} = Select


export default class ProductHome extends Component {
    state = {
        products: [
            {
                'status': 1,
                'imgs': [],
                '_id': '21344134',
                'name':  '联想',
                'description': 'laji',
                'price': 999,
                'pCategoryId': 'sdadqwdqw',
                'categoryId': 'ddqwdqwdqw',
                'detail': 'chaojilaji',
            },
            {
                'status': 0,
                'imgs': [],
                '_id': '21344132',
                'name':  '戴尔',
                'description': 'lajihaha',
                'price': 1999,
                'pCategoryId': 'sdadqwd13qw',
                'categoryId': 'ddqwdqw14dqw',
                'detail': 'yeshichaojilaji',
            }
        ],
        columns: []
    }

    initColumns = () => {
        this.setState({
            columns: [
                {
                    title: '商品名称',
                    dataIndex: 'name',
                    align: 'center',
                    width: 120,
                },
                {
                    title: '商品描述',
                    dataIndex: 'description',
                    align: 'center',
                    width: 500,
                },
                {
                    title: '价格',
                    dataIndex: 'price',
                    align: 'center',
                    render: (price) => '¥' + price
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    align: 'center',
                    render: (status) => {
                        return (
                            status === 0 ? (
                            <span>
                                <span style={{color: 'gray', marginRight: 30}}>未售</span>
                                <Button type='primary'>上架</Button>
                            </span>
                            ) :
                            (
                            <span>
                                <span style={{color: 'red', marginRight: 30}}>在售</span>
                                <Button type='primary'>下架</Button>
                            </span>
                            )
                        )
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    align: 'center',
                    render: (_, product) => {
                        return (
                            <span>
                                <Button type='link'>详情信息</Button>
                                <Button type='link'>修改信息</Button>
                            </span>
                        )
                    }
                },
            ]
        })
    }

    componentDidMount() {
        this.initColumns()
    }

    render() {
        const {products, columns} = this.state
        const title = (
            <span>
                <Select value='1' style={{width: 150}}>
                    <Option value='1'>按名称搜索</Option>
                    <Option value='2'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width: 150, margin: '0 20px'}}/>
                <Button type='primary'>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary'>
                <PlusOutlined />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table bordered dataSource={products} columns={columns} rowKey='_id'/>
            </Card>
        )
    }
}
