import React, { Component } from 'react'
import { Modal, Card, Button, Table, message, Popconfirm } from 'antd'
import { PlusOutlined, CaretRightOutlined } from '@ant-design/icons'
import { reqAddCategory, reqCategories, reqDeleteCategory, reqUpdateCategory } from '../../../api'
import AddForm from './AddForm'
import UpdateForm from './UpdateForm'

export default class Category extends Component {
    updateForm = React.createRef()
    addForm = React.createRef()

    state = {
        categories: [],
        subcategories: [],
        columns: [],
        isLoading: false,
        parentId: '0',
        parentName: '',
        isModalVisible: 0,
    }

    showAddModal = () => {
        this.setState({ isModalVisible: 1 });
    };

    showUpdateModal = (category) => {
        return () => {
            this.category = category
            this.setState({ isModalVisible: 2 })
        }
    };

    //添加分类
    addCategory = () => {
        const p = this.addForm.current.formRef.current.validateFields()
        p.then(async () => {
            this.setState({ isModalVisible: 0 })
            const categoryName = this.addForm.current.formRef.current.getFieldValue('categoryName')
            const parentId = this.addForm.current.formRef.current.getFieldValue('parentId')
            const result = await reqAddCategory(categoryName, parentId)
            if (result.data.status === 0) {
                if (parentId === this.state.parentId) {
                    this.getCategories() //显示新列表
                }
            }
        }).catch(err => console.log(err))
    };

    // 更新分类
    updateCategory = () => {
        const p = this.updateForm.current.formRef.current.validateFields()
        p.then(async () => {
            const categoryName = this.updateForm.current.formRef.current.getFieldValue('categoryName')
            this.setState({ isModalVisible: 0 })
            const categoryId = this.category._id
            const result = await reqUpdateCategory(categoryName, categoryId)
            if (result.data.status === 0) {
                this.getCategories() //显示新列表
            }
        }).catch(err => console.log(err))
    };

    //删除分类
    deleteCategory = (category) => {
        return async () => {
            const categoryId = category._id
            const result = await reqDeleteCategory(categoryId)
            if (result.data.status === 0) {
                this.getCategories()
            }
        }
    }

    handleCancel = () => {
        this.setState({ isModalVisible: 0 })
    };

    // 初始化表格Columns
    initColumns = () => {
        this.setState({
            columns: [
                {
                    title: '分类名称',
                    dataIndex: 'name',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    width: 350,
                    render: (_, category) => (
                        <div>
                            <Button type='link' onClick={this.showUpdateModal(category)}>修改分类</Button>
                            {this.state.parentId === '0' ?
                                <Button type='link' onClick={this.getSubcategories(category)}>查看子分类</Button> : 
                                null}
                            <Popconfirm
                                title="确认删除这个分类吗?"
                                onConfirm={this.deleteCategory(category)}
                                okText="确认删除"
                                cancelText="取消"
                            >
                                <Button type='link' danger>删除分类</Button>
                            </Popconfirm>
                        </div>
                    )
                },
            ]
        })
    }

    getCategories = async () => {
        this.setState({ isLoading: true })
        const { parentId } = this.state
        const response = await reqCategories(parentId)
        this.setState({ isLoading: false })
        if (response.data.status === 0) {
            const categories = response.data.data
            if (parentId === '0') {
                this.setState({ categories })
            } else {
                this.setState({ subcategories: categories })
            }
        } else {
            response.status === 200 ? //返回的response中没有data
                parentId === '0' ?
                    this.setState({ categories: [] }) :
                    this.setState({ subcategories: [] }) :
                message.error('获取分类列表失败')
        }
    }

    showCategories = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subcategories: []
        })
    }

    getSubcategories = (category) => {
        return () => {
            this.setState({
                parentId: category._id,
                parentName: category.name
            }, () => {
                this.getCategories()
            }) // setState可以接回调函数，在状态改变后立即执行
        }
    }

    componentDidMount() {
        this.initColumns()
        this.getCategories()
    }

    render() {
        const { categories, subcategories, parentId, columns, isLoading, parentName, isModalVisible } = this.state
        const title = parentId === '0' ? '一级分类' : (
            <span>
                <Button type="link" onClick={this.showCategories} style={{ fontSize: 16, fontWeight: 'bold', padding: 0 }}>一级分类</Button>
                <CaretRightOutlined style={{ marginRight: 10, marginLeft: 10 }} />
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAddModal}>
                <PlusOutlined />
                添加分类
            </Button>
        )

        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        dataSource={parentId === '0' ? categories : subcategories}
                        columns={columns}
                        rowKey='_id'
                        pagination={{ defaultPageSize: 5 }}
                        loading={isLoading} />
                </Card>
                <Modal title="添加分类" visible={isModalVisible === 1} onOk={this.addCategory} onCancel={this.handleCancel}>
                    <AddForm ref={this.addForm} categories={categories} parentId={parentId} />
                </Modal>
                <Modal title="更新分类" visible={isModalVisible === 2} onOk={this.updateCategory} onCancel={this.handleCancel}>
                    <UpdateForm ref={this.updateForm} categoryName={this.category ? this.category.name : ''} />
                </Modal>
            </div>
        )
    }
}
