import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
import PubSub from 'pubsub-js'
import menuList from '../../../config/menuConfig'

export default class TopNav extends Component {

    state = {
        title: ''
    }

    findDefaultTitle = (menuList) => {
        const currentPath = window.location.pathname
        const target = menuList.find(item => {
            if (item.children) {
                this.findDefaultTitle(item.children)
            } else {
                return item.key === currentPath
            }
            return null
        })
        if (target){
            this.setState({title: target.title})
        }
    }

    componentDidMount(){
        this.tokenMenuItem = PubSub.subscribe('menuItem', (_,menuItem) => {
            this.setState({title: menuItem.title})
        })
        this.findDefaultTitle(menuList)
    }

    componentWillUnmount(){
        PubSub.unsubscribe(this.tokenMenuItem)
    }

    render() {
        const {title} = this.state
        return (
            <Breadcrumb style={{ margin: '16px 0' }}>
                {
                    <Breadcrumb.Item>{title}</Breadcrumb.Item>
                }
            </Breadcrumb>
        )
    }
}
