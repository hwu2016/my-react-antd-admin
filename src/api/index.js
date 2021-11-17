/*
包括n个接口请求函数的模块
每个函数返回promise
*/
import { message } from "antd";
import ajax from "./ajax";

const BASE_URL = 'http://127.0.0.1:8000'

//登陆
export const reqLogin = (username, password) => ajax(BASE_URL + '/login', {username, password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE_URL + '/manage/user/add', user, 'POST')

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

//获取一级二级分类列表
export const reqCategories = (parentId) => ajax(BASE_URL + '/manage/category/list', {parentId})

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE_URL + '/manage/category/add', {categoryName, parentId}, 'POST')

//更新分类
export const reqUpdateCategory = (categoryName, categoryId) => ajax(BASE_URL + '/manage/category/update', {categoryName, categoryId}, 'POST')