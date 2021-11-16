import {
    ShoppingOutlined,
    HomeOutlined,
    PieChartOutlined,
    SafetyOutlined,
    UserOutlined,
    ApartmentOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';

const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: <HomeOutlined/>,
    },
    {
        title: '商品管理',
        key: '/management',
        icon: <ShoppingOutlined/>,
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: <ApartmentOutlined/>,
            },
            {
                title: '商品详情管理',
                key: '/product',
                icon: <DatabaseOutlined/>,
            }
        ] 
    },
    {
        title: '用户管理',
        key: '/user',
        icon: <UserOutlined/>,
    },
    {
        title: '权限管理',
        key: '/permission',
        icon: <SafetyOutlined/>,
    },
    {
        title: '统计图表',
        key: '/charts',
        icon: <PieChartOutlined/>,
    },
]

export default menuList