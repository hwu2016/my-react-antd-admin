//引入express框架
const express = require('express')
const app = express()
//引入mangoDB数据库
const { MongoClient, ObjectId } = require('mongodb')
const url = "mongodb://localhost:27017"
const client = new MongoClient(url);


//处理http request表单数据
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//数据库名
const dbName = 'my-react-admin'

//创建路由规则
//登陆
app.post('/login', (request, response) => {
    //接收client数据
    const { username, password } = request.body
    //连接数据库
    async function login() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { username, password }
            const result = await db.collection('users').find(data).toArray()
            if (result.length === 1) {
                response.send({ status: 0, user: result[0] })
            } else {
                response.send({ status: 1, msg: '用户名或密码输入错误' })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    login();
})

//查看一级分类列表
app.get('/manage/category/list', (request, response) => {
    //接收client数据
    const { parentId } = request.query
    //连接数据库
    async function showCategoryList() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { parentId: parentId }
            const result = await db.collection('manage_category').find(data).toArray()
            const allResults = result.map((item) => {
                return {
                    parentId: item.parentId,
                    _id: item._id,
                    name: item.name,
                }
            })
            if (result.length) {
                response.send({
                    status: 0,
                    data: allResults
                })
            } else {
                response.send({ status: 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    showCategoryList();
})

//添加一级分类
app.post('/manage/category/add', (request, response) => {
    //接收client数据
    const { categoryName, parentId } = request.body
    //连接数据库
    async function addCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { parentId, name: categoryName }
            const result = await db.collection('manage_category').insertOne(data)
            const newId = result.insertedId.toJSON()
            if (newId) {
                response.send({
                    status: 0,
                    data: {
                        parentId,
                        _id: newId,
                        name: categoryName
                    }
                })
            } else {
                response.send({ status: 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    addCategory();
})

//更新一级分类
app.put('/manage/category/update', (request, response) => {
    const { categoryName, categoryId } = request.body
    async function updateCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { name: categoryName }
            const result = await db.collection('manage_category').updateOne({ _id: ObjectId(categoryId) }, { $set: data })
            if (result.modifiedCount !== 0) {
                response.send({ status: 0 })
            } else {
                response.send({ status: 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    updateCategory();
})

//更新一级分类
app.put('/manage/category/update', (request, response) => {
    const { categoryName, categoryId } = request.body
    async function updateCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { name: categoryName }
            const result = await db.collection('manage_category').updateOne({ _id: ObjectId(categoryId) }, { $set: data })
            if (result.modifiedCount !== 0) {
                response.send({ status: 0 })
            } else {
                response.send({ status: 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    updateCategory();
})

//删除分类 删除一级分类需要修改！！！
app.delete('/manage/category/delete', (request, response) => {
    const { categoryId } = request.query
    async function deleteCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const result = await db.collection('manage_category').deleteOne(({ _id: ObjectId(categoryId) }))
            if (result.deletedCount > 0) {
                response.send({ status: 0 })
            } else {
                response.send({ status: 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    deleteCategory();
})


//获取所有分类
app.get('/manage/category/listAll', (request, response) => {
    async function showAllCategoryList() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const result = await db.collection('manage_category').find({}).toArray()
            const allResults = result.map((item) => {
                return {
                    parentId: item.parentId,
                    _id: item._id,
                    name: item.name,
                }
            })
            if (result.length) {
                response.send({
                    status: 0,
                    data: allResults
                })
            } else {
                response.send({ status: 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    showAllCategoryList();
})

//获取产品
app.get('/manage/product/pages', (request, response) => {
    const { pageNum, pageSize } = request.query
    async function showProductPages() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const result = await db.collection('manage_product').find({}).toArray()
            const products = pageFilter(result, pageNum, pageSize)
            if (products) {
                response.send({
                    status: 0,
                    data: products
                })
            } else {
                response.send({ status: 1, msg: '获取商品列表异常, 请重新尝试' })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    showProductPages();
})

//搜索产品
app.get('/manage/product/search', (request, response) => {
    const { pageNum, pageSize, productName, productDesc } = request.query
    async function showSearchResults() {
        try {
            await client.connect();
            const db = client.db(dbName);
            let condition = {}
            if (productName) {
                condition = { name: new RegExp(`^.*${productName}.*$`, 'i') }
            } else if (productDesc) {
                condition = { desc: new RegExp(`^.*${productDesc}.*$`, 'i') }
            }
            const result = await db.collection('manage_product').find(condition).toArray()
            const products = pageFilter(result, pageNum, pageSize)
            if (products) {
                response.send({
                    status: 0,
                    data: products
                })
            } else {
                response.send({ status: 1, msg: '搜索商品列表异常, 请重新尝试' })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    showSearchResults();
})

//获取某个产品的分类
app.get('/manage/category/targetInfo', (request, response) => {
    const { pCategoryId, categoryId } = request.query
    async function findTargetCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const parent = { _id: ObjectId(pCategoryId) }
            const child = { _id: ObjectId(categoryId) }
            const p_res = await db.collection('manage_category').find(parent).toArray()
            const c_res = await db.collection('manage_category').find(child).toArray()
            if (p_res && c_res) {
                response.send({
                    status: 0,
                    data: {
                        pCategoryName: p_res[0].name,
                        categoryName: c_res[0].name
                    }
                })
            } else {
                response.send({ status: 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    findTargetCategory();
})

//更新上下架状态
app.put('/manage/product/status', (request, response) => {
    const { productId, status } = request.body
    async function updateProductStatus() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const product = { _id: ObjectId(productId) }
            let result
            if (status === 0) {
                result = await db.collection('manage_product').updateOne(product, { $set: { status: 1 } })
            } else {
                result = await db.collection('manage_product').updateOne(product, { $set: { status: 0 } })
            }
            if (result.modifiedCount) {
                response.send({ status: 0 })
            } else {
                response.send({ status: 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    updateProductStatus();
})

//添加产品
app.post('/manage/product/add', (request, response) => {
    const {categoryId, pCategoryId, name, price, description, imgs, detail} = request.body.product
    async function addProduct() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { categoryId, pCategoryId, name, price, description, imgs, detail, status: 0}
            const result = await db.collection('manage_product').insertOne(data)
            if (result.insertedId) {
                response.send({
                    status: 0,
                    data
                })
            } else {
                response.send({ status: 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    addProduct();
})

//得到指定数组的分页信息对象
function pageFilter(arr, pageNum, pageSize) {
    pageNum = pageNum * 1
    pageSize = pageSize * 1
    const total = arr.length
    const pages = Math.floor((total + pageSize - 1) / pageSize)
    const start = pageSize * (pageNum - 1)
    const end = start + pageSize <= total ? start + pageSize : total
    const list = []
    for (let i = start; i < end; i++) {
        list.push(arr[i])
    }

    return {
        pageNum,
        total,
        pages,
        pageSize,
        list
    }
}


app.listen(8000, () => {
    console.log(`Server Starts, listening to port 8000...`)
})