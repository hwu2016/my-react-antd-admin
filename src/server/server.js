//引入express框架
const express = require('express')
const app = express()
//引入mangoDB数据库
const { MongoClient, ObjectId } = require('mongodb')
const url = "mongodb://localhost:27017"
const client = new MongoClient(url);
//引入md5加密
const md5 = require('blueimp-md5')

//声明使用静态中间件
app.use(express.static('public'))
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
            const data = { username, password: md5(password)}
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

//删除分类
app.delete('/manage/category/delete', (request, response) => {
    const { categoryId } = request.query
    async function deleteCategory() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const result = await db.collection('manage_category').deleteMany({
                $or:[{ _id: ObjectId(categoryId) }, { parentId: categoryId }]
            })
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
    const { categoryId, pCategoryId, name, price, description, imgs, detail } = request.body.product
    async function addProduct() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { categoryId, pCategoryId, name, price, description, imgs, detail, status: 0 }
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

//更新产品
app.put('/manage/product/update', (request, response) => {
    const { categoryId, pCategoryId, name, price, description, imgs, detail, _id } = request.body.product
    async function updateProduct() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const filter = { _id: ObjectId(_id) }
            const data = { categoryId, pCategoryId, name, price, description, imgs, detail }
            const result = await db.collection('manage_product').updateOne(filter, { $set: data })
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
    updateProduct();
})


/*
处理文件上传的路由
 */
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const dirPath = path.join(__dirname, 'public', 'upload')

const storage = multer.diskStorage({
    destination: function (req, file, cb) { //函数需手动创建文件夹
        if (!fs.existsSync(dirPath)) {
            fs.mkdir(dirPath, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    cb(null, dirPath)
                }
            })
        } else {
            cb(null, dirPath)
        }
    },
    filename: function (req, file, cb) {
        var ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})
const upload = multer({ storage })
const uploadSingle = upload.single('image')

//上传图片
app.post('/manage/img/upload', (req, res) => {
    uploadSingle(req, res, function (err) { //错误处理
        if (err) {
            return res.send({
                status: 1,
                msg: '上传文件失败'
            })
        }
        let file = req.file
        res.send({
            status: 0,
            data: {
                name: file.filename,
                url: 'http://localhost:8000/upload/'+ file.filename
            }
        })

    })
})

//删除图片
app.post('/manage/img/delete', (request, response) => {
    const { name } = request.body
    fs.unlink(path.join(dirPath, name), (err) => {
        if (err) {
            console.log(err)
            response.send({
                status: 1,
                msg: '删除文件失败'
            })
        } else {
            response.send({
                status: 0
            })
        }
    })
})

//展示权限管理角色列表
app.get('/manage/permission/roleList', (request, response) => {
    async function showRoleList() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const res = await db.collection('manage_permission').find({}).toArray()
            if (res) {
                response.send({
                    status: 0,
                    data: res
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
    showRoleList();
})

//添加角色
app.post('/manage/permission/add', (request, response) => {
    const { name } = request.body
    async function addRole() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const data = { 
                name,
                menus: [],
                create_time: Date.now()
            }
            const result = await db.collection('manage_permission').insertOne(data)
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
    addRole();
})

//设置角色权限
app.put('/manage/permission/setPerm', (request, response) => {
    const role = request.body
    async function setRolePerm (){
        try {
            await client.connect()
            const db = client.db(dbName)
            const {_id, menus, auth_name, auth_time} = role
            const result = await db.collection('manage_permission').updateOne({_id: ObjectId(_id)}, {$set:{
                menus, 
                auth_time,
                auth_name
            }})
            if (result.modifiedCount){
                response.send({
                    status: 0,
                    data: {...role}
                })
            } else {
                response.send({status: 1})
            }
        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    setRolePerm()

})

//删除角色
app.delete('/manage/permission/delete', (request, response) => {
    const { _id } = request.query
    async function deleteRole (){
        try {
            await client.connect()
            const db = client.db(dbName)
            const result = await db.collection('manage_permission').deleteOne({_id: ObjectId(_id)})
            if (result.deletedCount){
                response.send({status: 0})
            } else {
                response.send({status: 1})
            }
        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    deleteRole()
})

//获取所有用户列表
app.get('/users/list', (request, response) => {
    async function showUserList() {
        try {
            await client.connect();
            const db = client.db(dbName);
            const users = await db.collection('users').find({}).toArray()
            const roles = await db.collection('manage_permission').find({}).toArray()
            if (response) {
                response.send({
                    status: 0,
                    data: {
                        users,
                        roles
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
    showUserList();
})

//删除用户
app.delete('/users/delete', (request, response) => {
    const { userId } = request.query
    async function deleteUser (){
        try {
            await client.connect()
            const db = client.db(dbName)
            const admin_check = await db.collection('users').find({_id: ObjectId(userId)}).toArray()
            if (admin_check.length && admin_check[0].username === 'admin'){
                response.send({status: 1, msg:'admin用户必须存在'})
            } else {
                const result = await db.collection('users').deleteOne({_id: ObjectId(userId)})
                if (result.deletedCount){
                    response.send({status: 0})
                } else {
                    response.send({status: 1})
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    deleteUser()   
})

//添加用户
app.post('/users/add', (request, response) => {
    const { username, email, phone, password, role_id} = request.body
    async function addUser (){
        try {
            await client.connect()
            const db = client.db(dbName)
            const username_check = await db.collection('users').find({username}).toArray()
            if (username_check.length){
                response.send({status: 1, msg:'用户名已经存在'})
            } else {
                const perm = await db.collection('manage_permission').find({_id: ObjectId(role_id)}).toArray()
                const menus = perm[0].menus
                const data = {
                    username,
                    email,
                    phone,
                    password: md5(password),
                    role_id,
                    menus,
                    register_time: Date.now()
                }
                const result = await db.collection('users').insertOne(data)
                if (result.insertedId){
                    response.send({status: 0})
                } else {
                    response.send({status: 1})
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    addUser()   
})

//更新用户
app.put('/users/update', (request, response) => {
    const { username, email, phone, password, role_id, _id} = request.body
    async function updateUser (){
        try {
            await client.connect()
            const db = client.db(dbName)
            const admin_check = await db.collection('users').find({username: 'admin'}).toArray()
            if (admin_check[0]._id.toJSON() === _id && (username !== 'admin' || password !== md5('admin'))){
                response.send({status: 1, msg:'admin的用户名和密码无法更改！'})
            } else {
                const data = {
                    username,
                    email,
                    phone,
                    password,
                    role_id,
                }
                const result = await db.collection('users').updateOne({_id: ObjectId(_id)},{$set: data})
                if (result.modifiedCount){
                    response.send({status: 0})
                } else {
                    response.send({status: 1})
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            await client.close()
        }
    }
    updateUser()   
})


app.listen(8000, () => {
    console.log(`Server Starts, listening to port 8000...`)
})