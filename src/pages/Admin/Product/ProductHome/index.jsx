import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../../../api'
import { PAGE_SIZE } from '../../../../utils/constant'
import { Link } from 'react-router-dom';

const { Option } = Select

export default class ProductHome extends Component {
    state = {
        products: [],
        columns: [],
        total: 0,
        isLoading: false,
        searchKey: '',
        searchType: 'productName',
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
                    render: (_, product) => {
                        const { status } = product
                        return (
                            status === 0 ? (
                                <span>
                                    <span style={{ color: 'gray', marginRight: 30 }}>未售</span>
                                    <Button type='primary' onClick={this.updateStatus(product)}>上架</Button>
                                </span>
                            ) : (
                                <span>
                                    <span style={{ color: 'red', marginRight: 30 }}>在售</span>
                                    <Button type='primary' onClick={this.updateStatus(product)}>下架</Button>
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
                                <Button type='link'>
                                    <Link to='/product/details' state={product}>
                                        详情信息
                                    </Link>
                                </Button>
                                <Button type='link'>
                                    <Link to='/product/operation' state={product}>
                                        修改信息
                                    </Link>
                                </Button>
                            </span>
                        )
                    }
                },
            ]
        })
    }

    updateStatus = (product) => {
        return async () => {
            const { status, _id } = product
            const result = await reqUpdateStatus(_id, status)
            if (result.data.status === 0) {
                message.success('商品状态更新成功')
                this.getProducts(this.curPageNum)
            } else {
                message.error('商品状态更新失败')
            }
        }
    }

    getProducts = async (pageNum) => {
        this.curPageNum = pageNum //保存当前页码，供其他方法使用

        this.setState({ isLoading: true })

        const { searchKey, searchType } = this.state

        let result
        if (searchKey) {
            result = await reqSearchProducts(pageNum, PAGE_SIZE, searchKey, searchType)
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ isLoading: false })
        if (result.data.status === 0) {
            const { total, list } = result.data.data
            this.setState({
                total,
                products: list
            })
        } else {
            const { msg } = result.data
            message.error(msg)
        }
    }

    componentDidMount() {
        this.initColumns()
        this.getProducts(1)
    }

    render() {
        const { products, columns, total, isLoading, searchKey, searchType } = this.state
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={(value) => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 150, margin: '0 20px' }}
                    value={searchKey}
                    onChange={(e) => this.setState({ searchKey: e.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Link to='/product/operation'>
                <Button type='primary'>
                    <PlusOutlined />
                    添加商品
                </Button>
            </Link>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    dataSource={products}
                    columns={columns}
                    loading={isLoading}
                    rowKey='_id'
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        total,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}


