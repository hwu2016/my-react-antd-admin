/*
包括n个接口请求函数的模块
每个函数返回promise
*/
import { message } from "antd";
import ajax from "./ajax";

//登陆
export const reqLogin = (username, password) => ajax('http://127.0.0.1:8000/login', {username, password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax('http://127.0.0.1:8000/manage/user/add', user, 'POST')

//查询天气
export const reqWeather = (city) => {
    return new Promise((res, rej) => {
        const API_key = '49e9e209a1e21f37e9d876656cea684e'
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&lang=zh_cn`
        const request = ajax(url, {}, 'GET')
        request.then(response => {
            if (response.data.id) {
                const weather = response.data.weather[0].description
                const tempK = response.data.main.temp
                const tempC = (tempK - 273.15).toFixed(0)
                res([weather, tempC])
            } else {
                message.error('获取天气信息失败！')
            }
        })
    })
}
