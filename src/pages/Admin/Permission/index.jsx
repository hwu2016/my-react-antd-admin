import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../../utils/constant'
import { reqRoleList, reqAddRole } from '../../../api'
import AddForm from './AddForm'

export default class Permission extends Component {
    addForm = React.createRef()

    state = {
        roles: [],
        columns: [],
        role: {},
        isModalVisible: 0
    }


    showAddModal = () => {
        this.setState({ isModalVisible: 1 });
    };

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
                    dataIndex: 'create_time'
                },
                {
                    title: '授权时间',
                    dataIndex: 'auth_time'
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
                <Button type='primary' disabled={!role._id}>设置权限</Button>
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
            </Card>
        )
    }
}
