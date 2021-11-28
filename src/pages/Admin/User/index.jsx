import React, { Component } from 'react'
import { Card, Modal, Table, Button, message, Popconfirm} from 'antd'
import formatTime from '../../../utils/formatTime'
import { PAGE_SIZE } from '../../../utils/constant'
import AddUpdate from './AddUpdate'
import { reqAddUser, reqDeleteUser, reqUpdateUser, reqUsers } from '../../../api'

export default class User extends Component {
    addUpdateRef = React.createRef()

    state = {
        users: [],
        roles: [],
        columns: [],
        isModalVisible: false,
        isUpdate: false
    }

    initColumns = () => {
        this.setState({
            columns: [
                {
                    title: '用户名',
                    dataIndex: 'username'
                },
                {
                    title: '邮箱',
                    dataIndex: 'email'
                },
                {
                    title: '电话',
                    dataIndex: 'phone'
                },
                {
                    title: '注册时间',
                    dataIndex: 'register_time',
                    render: formatTime
                },
                {
                    title: '角色权限',
                    dataIndex: 'role_id',
                    render: (role_id) => {
                        const { roles } = this.state
                        const target = roles.find((role) => {
                            return role._id === role_id
                        })
                        return target.name ? target.name : ''
                    }
                },
                {
                    title: '操作',
                    render: (_,user) => {
                        return (
                            <span>
                                <Button type='link' onClick={() => this.showAddUpdateModal(user)}>修改</Button>
                                <Button type='link' >
                                    <Popconfirm
                                        title="确认删除该用户吗?"                            
                                        onConfirm={this.deleteUser(user)}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        删除
                                    </Popconfirm>
                                </Button>
                            </span>
                        )
                    }
                },
            ]
        })
    }

    showAddUpdateModal = (user) => {
        if (user) {
            this.user = user //保存user供其他函数使用
            this.setState({ isModalVisible: true, isUpdate: true })
        } else {
            this.user = null
            this.setState({ isModalVisible: true })
        }
    }

    handleCancel = () => {
        this.user = null
        this.setState({ isModalVisible: false, isUpdate: false })
    }

    getUsers = async () => {
        this.initColumns()
        const result = await reqUsers()
        if (result.data.status === 0) {
            const { users, roles } = result.data.data
            this.setState({
                users,
                roles
            })
        } else {
            message.error('加载用户列表失败，请检查网络')
        }
    }

    deleteUser = (user) => {
        return async () => {
            const {_id} = user
            const result = await reqDeleteUser(_id)
            if (result.data.status === 0){
                message.success('删除用户成功')
            } else {
                if (result.data.msg){
                    const {msg} = result.data
                    message.error(msg)
                } else {
                    message.error('删除用户失败')
                }
            }
            this.getUsers()
        }
    }

    addUpdateUser = async () => {
        const {isUpdate} = this.state
        const user = this.addUpdateRef.current.formRef.current.getFieldsValue(true)
        if (isUpdate){ // 更新用户
            user._id = this.user._id
            const update_result = await reqUpdateUser(user)
            if (update_result.data.status === 0){
                message.success('更新用户成功')
                this.getUsers()
            } else {
                const {msg} = update_result.data
                msg ? message.error(msg) : message.error('更新用户失败')
            }
        } else { // 添加用户
            const add_result = await reqAddUser(user)
            if (add_result.data.status === 0){
                message.success('添加用户成功')
                this.getUsers()
            } else {
                const {msg} = add_result.data
                msg ? message.error(msg) : message.error('添加用户失败')
            }
        }
        this.setState({isModalVisible: false})
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        const { users, columns, isModalVisible , isUpdate, roles} = this.state
        const user = this.user || {}

        const title = (
            <Button type='primary' onClick={() => this.showAddUpdateModal()}>创建用户</Button>
        )

        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                />
                <Modal title={isUpdate ? '修改用户' : '添加用户'} visible={isModalVisible === true} onOk={this.addUpdateUser} onCancel={this.handleCancel}>
                    <AddUpdate ref={this.addUpdateRef} roles={roles} user={user} />
                </Modal>
            </Card>
        )
    }
}
