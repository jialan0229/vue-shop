// import axios from 'axios'
import { request } from "./request";

function getLogin(username, password) {
  return request({
    url: '/login',
    method: "post",
    data: {
      username,
      password
    }
  })
}

function getHomeMenu() {
  return request({
    url: '/menus'
  })
}

function getUsers(query, pagenum, pagesize) {
  return request({
    url: '/users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

function putUsers(uId, type) {
  return request({
    url: `/users/${uId}/state/${type}`,
    method: 'put'
  })
}

function getAddUsers(username, password, email, mobile) {
  return request({
    url: '/users',
    method: 'post',
    data: {
      username, 
      password, 
      email, 
      mobile
    }
  })
}

function getEditUser(ids) {
  return request({
    url: `/users/${ids}`
  })
}

function putEditUser(id, email, mobile){
  return request({
    url: `/users/${id}`,
    method: 'put',
    data: { 
      email, 
      mobile
    }
  })
}

function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}
export{
  getLogin,
  getHomeMenu,
  getUsers,
  putUsers,
  getAddUsers,
  getEditUser,
  putEditUser,
  deleteUser
}