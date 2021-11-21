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


//创建路由规则
//登陆
app.post('/login', (request, response) => {
    //接收client数据
    const { username, password } = request.body
    //连接数据库
    async function login() {
        try {
            const dbName = 'my-react-admin'
            await client.connect();
            const db = client.db(dbName);
            const data = { 'username': username, 'password': password }
            const result = await db.collection('users').find(data).toArray()
            if (result.length === 1) {
                response.send({ 'status': 0, 'user': result[0] })
            } else {
                response.send({ 'status': 1, 'msg': '用户名或密码输入错误' })
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
    const dbName = 'my-react-admin'
    //连接数据库
    async function showCategoryList() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { 'parentId': parentId }
            const result = await db.collection('manage_category').find(data).toArray()
            const allResults = result.map((item) => {
                return {
                    "parentId": item.parentId,
                    "_id": item._id,
                    "name": item.name,
                }
            })
            if (result.length) {
                response.send({
                    'status': 0,
                    'data': allResults
                })
            } else {
                response.send({ 'status': 1 })
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
    const dbName = 'my-react-admin'
    //连接数据库
    async function addCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { 'parentId': parentId, 'name': categoryName }
            const result = await db.collection('manage_category').insertOne(data)
            const newId = result.insertedId.toJSON()
            if (newId) {
                response.send({
                    'status': 0,
                    'data': {
                        "parentId": parentId,
                        "_id": newId,
                        "name": categoryName
                    }
                })
            } else {
                response.send({ 'status': 1 })
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
    //接收client数据
    const { categoryName, categoryId } = request.body
    const dbName = 'my-react-admin'
    //连接数据库
    async function updateCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { 'name': categoryName }
            const result = await db.collection('manage_category').updateOne({ '_id': ObjectId(categoryId) }, { $set: data })
            if (result.modifiedCount !== 0) {
                response.send({ 'status': 0 })
            } else {
                response.send({ 'status': 1 })
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
    //接收client数据
    const { categoryName, categoryId } = request.body
    const dbName = 'my-react-admin'
    //连接数据库
    async function updateCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { 'name': categoryName }
            const result = await db.collection('manage_category').updateOne({ '_id': ObjectId(categoryId) }, { $set: data })
            if (result.modifiedCount !== 0) {
                response.send({ 'status': 0 })
            } else {
                response.send({ 'status': 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    updateCategory();
})

//删除一级分类
app.delete('/manage/category/delete', (request, response) => {
    //接收client数据
    const { categoryId } = request.query
    const dbName = 'my-react-admin'
    //连接数据库
    async function deleteCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const result = await db.collection('manage_category').deleteOne(({ '_id': ObjectId(categoryId) }))
            if (result.deletedCount > 0) {
                response.send({ 'status': 0 })
            } else {
                response.send({ 'status': 1 })
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    deleteCategory();
})


app.listen(8000, () => {
    console.log(`Server Starts, listening to port 8000...`)
})