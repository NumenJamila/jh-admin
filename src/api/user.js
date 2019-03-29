import axios from '@/libs/api.request'

export const login = ({ name, password }) => {
  const data = {
    name,
    password
  }
  return axios.request({
    url: '/auth/login',
    data,
    method: 'post'
  })
}

export const loginByAccessToken = (token) => {
  const data = {
    token
  }
  return axios.request({
    url: '/auth/loginByAccessToken',
    data,
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: '/auth/logout',
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: '/user/getUserInfo',
    method: 'get'
  })
}
export const updateMyself = ({id, nickName, mobile, email, head}) => {
  const data = {
    id, nickName, mobile, email, head
  }
  return axios.request({
    url: '/user/updateMyself',
    data,
    method: 'post'
  })
}

