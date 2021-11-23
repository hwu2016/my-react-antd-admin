import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Upload, Button, } from 'antd'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { reqCategories } from '../../../../api'

const { Item } = Form
const { TextArea } = Input

export default class ProductOperation extends Component {

    state = {
        options: []
    }

    getCategories = async (parentId) => {
        const result = await reqCategories(parentId)
        if (result.data.status === 0) {
            const categories = result.data.data
            if (parentId === '0') {
                this.initOptions(categories)
            } else {
                return categories
            }
        }
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        const subCategories = await this.getCategories(targetOption.value)
        targetOption.loading = false;

        if (subCategories && subCategories.length > 0) {
            const children = subCategories.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true
            }))
            targetOption.children = children
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options]
        })
    }

    initOptions = (categories) => {
        const options = categories.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: false
        }))
        this.setState({ options })
    }

    componentDidMount() {
        this.getCategories('0')
    }

    render() {
        const title = (
            <span>
                <Link to='/product/home'>
                    <LeftCircleOutlined />
                </Link>
                <span style={{ marginLeft: 10 }}>添加商品</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form labelCol={{ span: 2 }} wrapperCol={{ span: 12 }}>
                    <Item
                        label="商品名称"
                        name="name"
                        rules={[{ required: true, message: '商品名称不可为空' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        label="商品描述"
                        name="description"
                        rules={[{ required: true, message: '商品描述不可为空' }]}
                    >
                        <TextArea rows={4} maxLength={100} showCount />
                    </Item>
                    <Item
                        label="商品价格"
                        name="price"
                        validateFirst
                        wrapperCol={{ span: 5 }}
                        rules={[
                            { required: true, message: '商品价格不可为空' },
                            { pattern: /^\d+(\.{0,1}\d+){0,1}$/, message: '价格必须为非负数' }
                        ]}
                    >
                        <Input addonBefore="￥" addonAfter="RMB" />
                    </Item>
                    <Item
                        label="商品分类"
                        name="category"
                        wrapperCol={{ span: 5 }}
                        rules={[{ required: true, message: '必须添加分类' }]}
                    >
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item
                        label="商品图片"
                    >

                    </Item>
                    <Item
                        label="商品详情"
                    >

                    </Item>

                </Form>
            </Card>
        )
    }
}

