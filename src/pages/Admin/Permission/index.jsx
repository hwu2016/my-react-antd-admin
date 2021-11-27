import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../../utils/constant'
import { reqRoleList, reqAddRole, reqDeleteRole, reqSetPerm } from '../../../api'
import AddForm from './AddForm'
import PermForm from './PermForm'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import memoryUtils from '../../../utils/memoryUtils'

const {confirm} = Modal

export default class Permission extends Component {
    addForm = React.createRef()
    permForm = React.createRef()

    state = {
        roles: [],
        columns: [],
        role: {},
        isModalVisible: 0
    }

    showAddModal = () => {
        this.setState({ isModalVisible: 1 })
    };

    showPermModal = () => {
        this.setState({isModalVisible: 2})
    }

    showDeleteConfirm = () => {
        confirm({
          title: '确认删除这个角色吗',
          icon: <ExclamationCircleOutlined />,
          content: '这个操作非常危险，建议谨慎操作',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk: async () => {
            const {_id} = this.state.role
            const res = await reqDeleteRole(_id)
            if (res.data.status === 0){
                message.success('删除角色成功')
                this.showRoleList()
            } else {
                message.error('删除角色失败')
            }
          },
        })
      }

    handleCancel = () => {
        this.setState({ isModalVisible: 0 })
    };

    addRole = () => {
        const p = this.addForm.current.formRef.current.validateFields()
        p.then(async () => {
            this.setState({ isModalVisible: 0 })
            const role = this.addForm.current.formRef.current.getFieldValue('role')
            const result = await reqAddRole(role)
            if (result.data.status === 0) {
                this.showRoleList()
                message.success('添加角色成功')
            } else {
                message.error('添加角色失败')
            }
        }).catch(err => {
            console.log(err);
        })
    };

    setPerm = async () => {
        const { role } = this.state
        const {checkedKeys} = this.permForm.current.state
        role.menus = checkedKeys
        role.auth_name = memoryUtils.user.username
        role.auth_time = Date.now()
        const result = await reqSetPerm(role)
        if (result.data.status === 0) {
            message.success('设置权限成功')
            this.setState({ 
                isModalVisible: 0 ,
            })
            this.showRoleList()
        } else {
            message.error('设置权限失败')
        }
    }


    onRow = (role) => {
        return {
            onClick: e => {
                this.setState({ role })
            }
        }
    }

    showRoleList = async () => {
        const res = await reqRoleList()
        if (res.data.status === 0) {
            const roles = res.data.data
            this.setState({ roles })
        }
    }

    initColumns = () => {
        this.setState({
            columns: [
                {
                    title: '角色名称',
                    dataIndex: 'name'
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    render: (time) => {
                        const date = new Date(parseInt(time))
                        const year = date.getFullYear()
                        const month = date.getMonth()
                        const day = date.getDate()
                        return time ? `${year}-${month}-${day}` : ''
                    }
                },
                {
                    title: '授权时间',
                    dataIndex: 'auth_time',
                    render: (time) => {
                        const date = new Date(parseInt(time))
                        const year = date.getFullYear()
                        const month = date.getMonth()
                        const day = date.getDate()
                        return time ? `${year}-${month}-${day}` : ''
                    }
                },
                {
                    title: '授权人',
                    dataIndex: 'auth_name'
                },
            ]
        })
    }

    componentDidMount() {
        this.initColumns()
        this.showRoleList()
    }

    render() {
        const { roles, columns, role, isModalVisible } = this.state
        const title = (
            <span>
                <Button type='primary' style={{ marginRight: 20 }} onClick={this.showAddModal}>创建角色</Button>
                <Button type='primary' disabled={!role._id} style={{ marginRight: 20 }} onClick={this.showPermModal}>设置权限</Button>
                <Button type='primary' disabled={!role._id} danger onClick={this.showDeleteConfirm}>删除角色</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    dataSource={roles}
                    rowKey='_id'
                    columns={columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onChange: (role) => {
                            this.setState({ role })
                        }
                    }}
                    onRow={this.onRow}
                />
                <Modal title="添加角色" visible={isModalVisible === 1} onOk={this.addRole} onCancel={this.handleCancel}>
                    <AddForm ref={this.addForm} />
                </Modal>
                <Modal title="设置权限" visible={isModalVisible === 2} onOk={this.setPerm} onCancel={this.handleCancel}>
                    <PermForm ref={this.permForm} role={role} />
                </Modal>
            </Card>
        )
    }
}
