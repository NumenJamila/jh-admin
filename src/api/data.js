import axios from '@/libs/api.request'

export const getRoleData = ({
  pageNo,
  pageSize
}) => {
  const data = {
    pageNo,
    pageSize
  }
  return axios.request({
    url: '/hzy/role/list',
    data,
    method: 'post'
  })
}
export const updateRoleData = ({
  id,
  roleName,
  roleDesc,
  enName
}) => {
  const data = {
    id,
    roleName,
    roleDesc,
    enName
  }
  return axios.request({
    url: '/hzy/role/update',
    data,
    method: 'post'
  })
}
export const deleteRoleData = (id) => {
  return axios.request({
    url: '/hzy/role/delete',
    params: {
      id
    },
    method: 'get'
  })
}
export const addRoleData = ({
  roleName,
  roleDesc,
  enName
}) => {
  const data = {
    roleName,
    roleDesc,
    enName
  }
  return axios.request({
    url: '/hzy/role/add',
    data,
    method: 'post'
  })
}
export const getMenuData = ({
  pageNo,
  pageSize
}) => {
  const data = {
    pageNo,
    pageSize
  }
  return axios.request({
    url: '/hzy/menu/list',
    data,
    method: 'post'
  })
}
export const addMenuData = ({
  name,
  menuDesc,
  menuIcon,
  menuUrl,
  menuCode,
  parentName,
  parentId,
  sort,
  level
}) => {
  const data = {
    name,
    menuDesc,
    menuIcon,
    menuUrl,
    menuCode,
    parentName,
    parentId,
    sort,
    level
  }
  return axios.request({
    url: '/hzy/menu/add',
    data,
    method: 'post'
  })
}
export const updateMenuData = ({
  id,
  name,
  menuDesc,
  menuIcon,
  menuUrl,
  menuCode,
  parentName,
  parentId,
  sort,
  level
}) => {
  const data = {
    id,
    name,
    menuDesc,
    menuIcon,
    menuUrl,
    menuCode,
    parentName,
    parentId,
    sort,
    level
  }
  return axios.request({
    url: '/hzy/menu/update',
    data,
    method: 'post'
  })
}
export const deleteMenuData = (id) => {
  return axios.request({
    url: '/hzy/menu/delete',
    params: {
      id
    },
    method: 'get'
  })
}
export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
