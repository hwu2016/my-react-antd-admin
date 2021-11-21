import React, { Component } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProductHome from './ProductHome'
import ProductOperation from './ProductOperation'
import ProductDetails from './ProductDetails'
import NotFound from '../NotFound'

export default class Product extends Component {
    render() {
        return (
            <Routes>
                <Route path='/home' element={<ProductHome/>}/>
                <Route path='/operation' element={<ProductOperation/>}/>
                <Route path='/details' element={<ProductDetails/>}/>
                <Route path='/' element={<Navigate replace to='/product/home'/>}/>
                <Route path='*' element={<NotFound/>}/>
            </Routes>
        )
    }
}
