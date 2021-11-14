/*能发送异步ajax请求的模块
封装axios
优化：统一处理请求一场
*/


import { message } from "antd";
import axios from "axios";

axios.defaults.baseURL = 'http://127.0.0.1:8000'

export default function ajax(url, data={}, type='GET'){
    return new Promise ((res, rej) => {
        let promise
        if(type === 'GET'){
            promise = axios.get(url, {params: data})
        } else {
            promise = axios.post(url, data)
        }
        promise.then(response => {
            res(response)
        }).catch(error => {
            message.error('Connection error:' + error.message)
        })
    })
}

