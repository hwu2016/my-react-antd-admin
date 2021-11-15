//引入express框架
const express = require('express')
const app = express()
//引入mangoDB数据库
const { MongoClient } = require('mongodb')
const url = "mongodb://localhost:27017"
const client = new MongoClient(url);

//处理http request表单数据
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//创建路由规则
app.all('/login', (request, response) => {
    //允许跨域
    response.setHeader('Access-Control-Allow-Origin','*')
    response.setHeader('Access-Control-Allow-Headers','*');
    //接收client数据
    const {username, password} = request.body
    //连接数据库
    async function login(){
        const dbName = 'my-react-admin'
        try {
            await client.connect();
            console.log('Connect to database!')
            const db = client.db(dbName);
            const data = {'username': username, 'password': password}
            const result = await db.collection('users').find(data).toArray()
            if (result.length === 1){
                response.send({'status': 0, 'user': result[0]})
            } else {
                response.send({'status': 1, 'msg': '用户名或密码输入错误'})
            }
        } catch (e) {
            console.error(e);
        } finally { 
            await client.close();
        }
    }
    login();
})

app.listen(8000, () => {
    console.log('Listening to Port 8000')
})