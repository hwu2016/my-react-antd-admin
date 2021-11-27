import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tree } from 'antd'
import menuList from '../../../../config/menuConfig'

const { Item } = Form

export default class PermForm extends Component {
    constructor (props){
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
        this.treeData = [
            {
                title: '权限管理',
                key: 'parent',
                children: this.recurTreeData(menuList)
            }
        ]
    }

    static propTypes = {
        role: PropTypes.object.isRequired
    }

    recurTreeData = (tree) => {
        return tree.map((node) => {
            if (!node.children) {
                return {
                    title: node.title,
                    key: node.key
                }
            } else {
                return {
                    title: node.title,
                    key: node.key,
                    children: this.recurTreeData(node.children)
                }
            }
        })
    }

    onCheck = (checkedKeys) => {
        this.setState({checkedKeys})
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({
            checkedKeys: nextProps.role.menus
        })
    }

    render() {
        const {checkedKeys} = this.state
        const { role } = this.props
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 10 }
        }
        return (
            <Form>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                    treeData={this.treeData}
                />
            </Form>
        )
    }
}
