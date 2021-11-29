import React, { Component } from 'react'
import { Tabs } from 'antd'
import Sale from './Sale'
import Benefit from './Benefit'

const { TabPane } = Tabs

const Demo = () => (
    <Tabs
        defaultActiveKey="1"
        onChange={(key)=>{console.log(key);}}
        destroyInactiveTabPane
    >
        <TabPane tab="商品销量统计" key="1" >
            <Sale />
        </TabPane>
        <TabPane tab="利润及利润率" key="2" >
            <Benefit/>
        </TabPane>
    </Tabs>
);

export default class Charts extends Component {
    render() {
        return (
            <div>
                <Demo />
            </div>
        )
    }
}
