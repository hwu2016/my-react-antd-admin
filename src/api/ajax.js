/*能发送异步ajax请求的模块
封装axios
优化：统一处理请求异常
*/


import { message } from "antd";
import axios from "axios";

export default function ajax(url, data={}, type='GET'){
    return new Promise ((res, rej) => {
        let promise
        switch (type) {
            case 'GET':
                promise = axios.get(url, {params: data})
                break
            case 'POST':
                promise = axios.post(url, data)
                break
            case 'PUT':
                promise = axios.put(url, data)
                break
            case 'DELETE':
                promise = axios.delete(url, {params: data})
                break
            default:
                message.error('获取信息失败：无法识别的请求类型')
        }
        promise.then(response => {
            res(response)
        }).catch(error => {
            message.error('获取信息失败：' + error.message)
        })
    })
}

