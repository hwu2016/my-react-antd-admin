import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import Admin from './pages/Admin'
import Login from './pages/Login'
import 'normalize.css'

export default class App extends Component {  
    render() {
        return (
            <div>
                <Router>
                    <Routes>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/admin' element={<Admin/>}/>
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </div>
        )
    }
}
