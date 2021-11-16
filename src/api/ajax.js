/*能发送异步ajax请求的模块
封装axios
优化：统一处理请求异常
*/


import { message } from "antd";
import axios from "axios";

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

