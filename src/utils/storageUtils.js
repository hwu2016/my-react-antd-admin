//操作local storage的工具函数模块
import store from 'store'
const USER_KEY = 'user_key'


const storageUtils = {
    saveUser(user){
        store.set(USER_KEY, user)
    },

    getUser(){
        return store.get(USER_KEY) || {}
    },

    removeUser() {
        store.remove(USER_KEY)
    }
}

export default storageUtils