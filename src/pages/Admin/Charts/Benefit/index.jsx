import React, { Component } from 'react'
import * as echarts from 'echarts'

export default class Benefit extends Component {
    benefitChartInit = () => {
        const dom = document.getElementById('benefit')
        const benefit = echarts.init(dom)
        // 模拟数据
        const gross = [122, 80, 100, 150]
        const net = [40, 13, -12, 50]
        const perc = gross.map((item, i) => {
            return (item / net[i]).toFixed(2)
        })
        const option = {
            title: {
              text: '2021年季度营收'
            },
            legend: {
              data: ['毛利润','净利润', '利润率']
            },
            toolbox: {
              feature: {
                magicType: {
                  type: ['stack']
                },
                dataView: {},
                saveAsImage: {
                  pixelRatio: 2
                }
              }
            },
            tooltip: {},
            xAxis: {
              data: ['第一季度','第二季度','第三季度','第四季度',],
              splitLine: {
                show: false
              },
            },
            yAxis: {
               name:'万元/人民币'
            },
            series: [
              {
                name: '毛利润',
                type: 'bar',
                data: gross,
                emphasis: {
                  focus: 'series'
                },
                animationDelay: function (idx) {
                  return idx * 10;
                }
              },
              {
                name: '净利润',
                type: 'bar',
                data: net,
                emphasis: {
                  focus: 'series'
                },
                animationDelay: function (idx) {
                  return idx * 10 + 100;
                }
              },
              {
                name: '利润率',
                type: 'line',
                data: perc,
              }
            ],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
              return idx * 5;
            }
          };
        benefit.setOption(option)
    }

    componentDidMount(){
        this.benefitChartInit()
    }

    render() {
        return (
            <div id='benefit' style={{ width: '1100px', height: '500px' }}></div>
        )
    }
}
