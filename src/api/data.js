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
    url: '/role/list',
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
    url: '/role/update',
    data,
    method: 'post'
  })
}
export const deleteRoleData = (id) => {
  return axios.request({
    url: '/role/delete',
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
    url: '/role/add',
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
    url: '/menu/list',
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
    url: '/menu/add',
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
    url: '/menu/update',
    data,
    method: 'post'
  })
}
export const deleteMenuData = (id) => {
  return axios.request({
    url: '/menu/delete',
    params: {
      id
    },
    method: 'get'
  })
}
export const getPermissionData = ({
  pageNo,
  pageSize
}) => {
  const data = {
    pageNo,
    pageSize
  }
  return axios.request({
    url: '/permission/list',
    data,
    method: 'post'
  })
}
export const addPermissionData = ({
  name,
  permissionDesc,
  permissionCode
}) => {
  const data = {
    name,
    permissionDesc,
    permissionCode
  }
  return axios.request({
    url: '/permission/add',
    data,
    method: 'post'
  })
}
export const updatePermissionData = ({
  id,
  name,
  permissionDesc,
  permissionCode
}) => {
  const data = {
    id,
    name,
    permissionDesc,
    permissionCode
  }
  return axios.request({
    url: '/permission/update',
    data,
    method: 'post'
  })
}
export const deletePermissionData = (id) => {
  return axios.request({
    url: '/permission/delete',
    params: {
      id
    },
    method: 'get'
  })
}
export const getJobData = () => {
  return axios.request({
    url: '/job/list',
    method: 'post'
  })
}
export const addJobData = ({
  jobName,
  jobGroup,
  description,
  jobClassName,
  cronExpression
}) => {
  const data = {
    jobName,
    jobGroup,
    description,
    jobClassName,
    cronExpression
  }
  return axios.request({
    url: '/job/add',
    data,
    method: 'post'
  })
}
export const updateJobData = ({
  id,
  jobName,
  jobGroup,
  description,
  jobClassName,
  cronExpression,
  oldJobName,
  triggerState,
  oldJobGroup
}) => {
  const data = {
    id,
    jobName,
    jobGroup,
    description,
    jobClassName,
    cronExpression,
    oldJobName,
    triggerState,
    oldJobGroup
  }
  return axios.request({
    url: '/job/add',
    data,
    method: 'post'
  })
}
export const deleteJobData = (data) => {
  return axios.request({
    url: '/job/delete',
    data,
    method: 'post'
  })
}
export const pauseJobData = (data) => {
  return axios.request({
    url: '/job/pause',
    data,
    method: 'post'
  })
}
export const resumeJobData = (data) => {
  return axios.request({
    url: '/job/resume',
    data,
    method: 'post'
  })
}
export const triggerJobData = (data) => {
  return axios.request({
    url: '/job/trigger',
    data,
    method: 'post'
  })
}
export const getFirstMenu = () => {
  return axios.request({
    url: '/role/getFirstMenu',
    method: 'get'
  })
}
export const getPermission = (menuId, roleId) => {
  return axios.request({
    url: '/role/getPermission',
    method: 'get',
    params: {
      menuId,
      roleId
    }
  })
}
export const updatePermissionNew = (roleId, permissionIds) => {
  return axios.request({
    url: '/role/updatePermissionNew',
    params: {
      roleId,
      permissionIds
    },
    method: 'get'
  })
}
export const getUserData = ({
  pageNo,
  pageSize
}) => {
  const data = {
    pageNo,
    pageSize
  }
  return axios.request({
    url: '/user/list',
    data,
    method: 'post'
  })
}
export const updateUserData = ({
  id,
  nickName,
  name,
  mobile,
  email
}) => {
  const data = {
    id,
    nickName,
    name,
    mobile,
    email
  }
  return axios.request({
    url: '/user/update',
    data,
    method: 'post'
  })
}
export const deleteUserData = (id) => {
  return axios.request({
    url: '/user/delete',
    params: {
      id
    },
    method: 'get'
  })
}
export const addUserData = ({
  nickName,
  name,
  password,
  mobile,
  email
}) => {
  const data = {
    nickName,
    name,
    password,
    mobile,
    email
  }
  return axios.request({
    url: '/user/add',
    data,
    method: 'post'
  })
}
export const getRoleUserList = ({
  roleId,
  pageNo,
  pageSize
}) => {
  const data = {
    roleId,
  pageNo,
  pageSize
  }
  return axios.request({
    url: '/role/getRoleUserList',
    data,
    method: 'post'
  })
}
export const getOtherUsersList = (roleId) => {
  return axios.request({
    url: '/role/getOtherUsersList',
    params:{
      roleId: roleId
    },
    method: 'get'
  })
}
export const deleteRoleUserRel = (id) => {
  return axios.request({
    url: '/role/deleteRoleUserRel',
    params:{
      relId: id
    },
    method: 'get'
  })
}
export const addRoleUsersRel = ({roleId, userIds}) => {
  const data = {
    roleId, userIds
  }
  return axios.request({
    url: '/role/addRoleUsersRel',
    data,
    method: 'post'
  })
}
