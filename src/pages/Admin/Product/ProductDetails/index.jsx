import { Card, List, message } from 'antd'
import { LeftCircleOutlined } from '@ant-design/icons'
import React, { Component } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { reqTargetCategory } from '../../../../api'
// import { BASE_IMG_URL } from '../../../../utils/constant';

const { Item } = List

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

class ProductDetails extends Component {
    state = {
        pCategoryName: '',
        categoryName: ''
    }

    async componentDidMount() {
        const {pCategoryId, categoryId} = this.props.location.state
        const result = await reqTargetCategory(pCategoryId, categoryId)
        if (result.data.status === 0) {
            const {pCategoryName, categoryName} = result.data.data
            this.setState({pCategoryName, categoryName})
        } else {
            const {msg} = result.data
            message.error(msg)
        }
    }

    render() {
        const { name, description, price, detail , imgs} = this.props.location.state

        const {pCategoryName, categoryName} = this.state

        const title = (
            <span>
                <Link to='/product/home'>
                    <LeftCircleOutlined />
                </Link>
                <span style={{ marginLeft: 10 }}>商品详情</span>
            </span>
        )


        return (
            <Card title={title}>
                <List>
                    <Item>
                        <span>
                            <b>商品名称：</b>{name}
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <b>商品描述：</b>{description}
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <b>商品价格：</b>¥{price}
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <b>商品分类：</b>{pCategoryName} - {categoryName}
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <b>商品图片：</b>{imgs}
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <b>商品详情：</b>{detail}
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}

export default withRouter(ProductDetails)
