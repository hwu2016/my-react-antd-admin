/*
包括n个接口请求函数的模块
每个函数返回promise
*/

import { message } from "antd";
import ajax from "./ajax.js";
import { BASE_URL, WEATHER_API_KEY } from "../utils/constant.js";

//登陆
export const reqLogin = (username, password) => ajax(BASE_URL + '/login', {username, password}, 'POST')

//查询天气
export const reqWeather = (city) => {
    return new Promise((res, rej) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&lang=zh_cn`
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
export const reqCategories = (parentId) => ajax(BASE_URL + '/manage/category/list', {parentId}, 'GET')

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE_URL + '/manage/category/add', {categoryName, parentId}, 'POST')

//更新分类
export const reqUpdateCategory = (categoryName, categoryId) => ajax(BASE_URL + '/manage/category/update', {categoryName, categoryId}, 'PUT')

//删除分类
export const reqDeleteCategory = (categoryId) => ajax(BASE_URL + '/manage/category/delete', {categoryId}, 'DELETE')

//获取所有分类
export const reqAllCategories = () => ajax(BASE_URL + '/manage/category/listAll', {}, 'GET')

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE_URL + '/manage/product/pages', {pageNum, pageSize}, 'GET') 

//搜索商品分页列表
export const reqSearchProducts = (pageNum, pageSize, searchKey, searchType) => ajax(BASE_URL + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchKey
}, 'GET')

//获取指定商品的分类
export const reqTargetCategory = (pCategoryId, categoryId) => ajax(BASE_URL + '/manage/category/targetInfo', {pCategoryId, categoryId}, 'GET')

//更新上下架状态
export const reqUpdateStatus = (productId, status) => ajax(BASE_URL + '/manage/product/status', {productId, status}, 'PUT')

//添加商品
export const reqAddProduct = (product) => ajax(BASE_URL + '/manage/product/add', {product}, 'POST')

//更新商品
export const reqUpdateProduct = (product) => ajax(BASE_URL + '/manage/product/update', {product}, 'PUT')

//删除图片
export const reqDeleteImg = (name) => ajax(BASE_URL + '/manage/img/delete', {name}, 'POST')

//获取角色列表
export const reqRoleList = () => ajax(BASE_URL + '/manage/permission/roleList', {}, 'GET')

//添加角色
export const reqAddRole = (name) => ajax(BASE_URL + '/manage/permission/add', {name}, 'POST')