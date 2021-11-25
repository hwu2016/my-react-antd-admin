import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, message, } from 'antd'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'
import { reqAddProduct, reqAllCategories } from '../../../../api'
import { Navigate } from 'react-router-dom'

const { Item } = Form
const { TextArea } = Input

//自定义高阶组件withRouter，接受参数
const withRouter = WrappedComponent => props => {
    const location = useLocation()
    return (
        <WrappedComponent
            {...props}
            location={location}
        />
    )
}

class ProductOperation extends Component {
    formRef = React.createRef()

    state = {
        options: [],
        isUpdate: false,
        isDone: false
    }

    initOptions = async () => {
        //获取所有分类
        const res = await reqAllCategories()
        if (res.data.status === 0) {
            const allCategories = res.data.data
            //获取所有父分类
            const pCategories = allCategories.filter(parent => parent.parentId === '0')
            const options = pCategories.map((parent) => {
                const children = allCategories.filter((child) => {
                    return child.parentId === parent._id
                })
                if (children && children.length > 0) {
                    const subCategories = children.map((child) => {
                        return {
                            value: child._id,
                            label: child.name
                        }
                    })
                    return {
                        value: parent._id,
                        label: parent.name,
                        children: subCategories,
                    }
                } else {
                    return {
                        value: parent._id,
                        label: parent.name,
                    }
                }
            })
            this.setState({ options })
        }
    }

    submitProduct = async () => {
        const { isUpdate } = this.state
        //收集表单数据
        const allFields = this.formRef.current.getFieldsValue(true)
        const { name, price, description } = allFields
        const pCategoryId = allFields.category[0]
        const categoryId = allFields.category[1]
        //发送ajax请求
        const product = {
            name,
            price,
            description,
            pCategoryId,
            categoryId,
            imgs: [],
            detail: '',
        }
        const response = await reqAddProduct(product)
        //返回home并更新页面
        if (response.data.status === 0) {
            message.success(`${isUpdate ? '更新' : '添加'}商品成功`)
            this.setState({ isDone: true })

        } else {
            message.error(`${isUpdate ? '更新' : '添加'}商品失败`)
        }
    }

    componentDidMount() {
        this.initOptions()
        if (this.props.location.state) {
            this.setState({ isUpdate: true })
        }
    }

    render() {
        const title = (
            <span>
                <Link to='/product/home'>
                    <LeftCircleOutlined />
                </Link>
                <span style={{ marginLeft: 10 }}>添加/更新商品</span>
            </span>
        )
        const { options, isDone } = this.state

        const { description, detail, imgs, name, price, pCategoryId, categoryId } = this.props.location.state || {}

        return (
            <Card title={title}>
                {isDone && (
                    <Navigate to='/product/home' replace/>
                )}
                <Form
                    ref={this.formRef}
                    name='operation'
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 12 }}
                    initialValues={{
                        name,
                        price,
                        imgs,
                        detail,
                        description,
                        category: this.props.location.state ? [pCategoryId, categoryId] : []
                    }}
                >
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
                            options={options}
                        />
                    </Item>
                    <Item
                        label="商品图片"
                        name="imgs"
                    >

                    </Item>
                    <Item
                        label="商品详情"
                        name="detail"
                    >

                    </Item>
                    <Item>
                        <span>
                            <Button type='primary' onClick={this.submitProduct}>提交</Button>
                            <Button type='link'>
                                <Link to='/product/home'>取消</Link>
                            </Button>
                        </span>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default withRouter(ProductOperation)

