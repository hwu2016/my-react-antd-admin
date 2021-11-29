import React, { Component } from 'react'
import { reqCategories } from '../../../../api'
import * as echarts from 'echarts'
import _ from 'lodash'

export default class Sale extends Component {
    state = {
        categories: [],
        saleData: []
    }

    initSaleData = async () => {
        const result = await reqCategories('0')
        const categories = result.data.data.map((category) => {
            return category.name
        })
        // 随机模拟后台返回的销量数据
        const saleData = categories.map(() => {
            return _.random(2000)
        })
        this.setState({ categories, saleData },
            () => { this.saleChartInit(this.state.categories, this.state.saleData) }
        )
    }



    saleChartInit = (categories, data) => {
        const dom_bar = document.getElementById('sale_bar')
        const dom_pie = document.getElementById('sale_pie')
        const sale_bar = echarts.init(dom_bar)
        const sale_pie = echarts.init(dom_pie)
        const pieData = categories.map((category, index) => {
            return {
                value: data[index],
                name: category
            }
        })
        const option_bar = {
            tooltip: {
                trigger: 'item'
            },
            xAxis: {
                type: 'category',
                data: categories,
                name: '一级分类'
            },
            yAxis: {
                type: 'value',
                name: '销量/单'
            },
            series: [
                {
                    data,
                    type: 'bar'
                }
            ]
        };

        const option_pie = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'horizontal',
                left: 'left',
            },
            series: [
                {
                    name: '分类销量',
                    type: 'pie',
                    radius: '70%',
                    data: pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        sale_bar.setOption(option_bar)
        sale_pie.setOption(option_pie)
    }

    componentDidMount = () => {
        this.initSaleData()
    }

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <span id='sale_bar' style={{ width: '600px', height: '500px' }}></span>
                <span id="sale_pie" style={{ width: '500px', height: '500px' }}></span>
            </div>
        )
    }
}
