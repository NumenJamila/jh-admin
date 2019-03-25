import axios from '@/libs/api.request'

export const login = ({ name, password }) => {
  const data = {
    name,
    password
  }
  return axios.request({
    url: '/hzy/auth/login',
    data,
    method: 'post'
  })
}

export const loginByAccessToken = (token) => {
  const data = {
    token
  }
  return axios.request({
    url: '/hzy/auth/loginByAccessToken',
    data,
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: '/hzy/auth/logout',
    method: 'post'
  })
}
export const getUserInfo = () => {
  return axios.request({
    url: '/hzy/user/getUserInfo',
    method: 'get'
  })
}
export const updateMyself = ({id, nickName, mobile, email, head}) => {
  const data = {
    id, nickName, mobile, email, head
  }
  return axios.request({
    url: '/hzy/user/updateMyself',
    data,
    method: 'post'
  })
}
export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
