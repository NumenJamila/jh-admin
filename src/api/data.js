import axios from '@/libs/api.request'

// 后台管理-公司标签接口 : TagApi
export const tagDelete = ( data ) => {
  return axios.request({
    url: '/tag/delete?id=' + data,
    method: 'post'
  })
}
export const tagList = ( data ) => {
  return axios.request({
    url: '/tag/list',
    data,
    method: 'post'
  })
}
export const tagSave = ( data ) => {
  return axios.request({
    url: '/tag/save',
    data,
    method: 'post'
  })
}

// 后台管理-浏览历史接口 : BrowseHistoryApi
export const browseHistoryDelete = ({
  pageNo,
  pageSize
}) => {
  const data = {
    pageNo,
    pageSize
  }
  return axios.request({
    url: '/browseHistory/delete',
    data,
    method: 'post'
  })
}
export const browseHistoryList = ( data ) => {
  return axios.request({
    url: '/browseHistory/list',
    data,
    method: 'post'
  })
}
export const browseHistorySave = ({
  pageNo,
  pageSize
}) => {
  const data = {
    pageNo,
    pageSize
  }
  return axios.request({
    url: '/browseHistory/save',
    data,
    method: 'post'
  })
}

// 后台管理-历史收藏接口 : CollectedApi
export const collectDelete = ( data ) => {
  return axios.request({
    url: '/collect/delete?id=' + data,
    data,
    method: 'post'
  })
}
export const collectList = ( data ) => {
  return axios.request({
    url: '/collect/list',
    data,
    method: 'post'
  })
}
export const collectSave = ( data ) => {
  return axios.request({
    url: '/collect/save',
    data,
    method: 'post'
  })
}

// 后台管理-公司信息接口 : CompanyInfoApi
export const companyinfoDelete = ( data ) => {
  return axios.request({
    url: '/companyinfo/delete?id=' + data,
    data,
    method: 'post'
  })
}
export const companyinfoList = ( data ) => {
  return axios.request({
    url: '/companyinfo/list',
    data,
    method: 'post'
  })
}
export const companyinfoSave = ( data ) => {
  return axios.request({
    url: '/companyinfo/save',
    data,
    method: 'post'
  })
}

// 后台管理-公司评价信息接口 : CompanyAppraiseApi
export const companyAppraiseDelete = ( data ) => {
  return axios.request({
    url: '/companyAppraise/delete?id=' + data,
    data,
    method: 'post'
  })
}
export const companyAppraiseList = ( data ) => {
  return axios.request({
    url: '/companyAppraise/list',
    data,
    method: 'post'
  })
}
export const companyAppraiseSave = ( data ) => {
  return axios.request({
    url: '/companyAppraise/save',
    data,
    method: 'post'
  })
}

// 后台管理-评价分类接口 : AppraiseApi
export const appraiseDelete = ( data ) => {
  return axios.request({
    url: '/appraise/delete?id=' + data,
    method: 'post'
  })
}
export const appraiseGetAppraiseList = () => {
  return axios.request({
    url: '/appraise/getAppraiseList',
    method: 'get'
  })
}
export const appraiseList = ({
  pageNo,
  pageSize
}) => {
  const data = {
    pageNo,
    pageSize
  }
  return axios.request({
    url: '/appraise/list',
    data,
    method: 'post'
  })
}
export const appraiseSave = ( data ) => {
  return axios.request({
    url: '/appraise/save',
    data,
    method: 'post'
  })
}
export const appraiseUpdatePercent = ( data ) => {
  return axios.request({
    url: '/appraise/updatePercent',
    data,
    method: 'post'
  })
}

// 后台管理-产业信息接口 : DomainApi
export const domainDelete = ( data ) => {
  return axios.request({
    url: '/domain/delete?id=' + data,
    method: 'post'
  })
}
export const domaingetDomainList = (id) => {
  return axios.request({
    url: '/domain/getDomainList',
    params: {
      id
    },
    method: 'get'
  })
}
export const domainList = ( data ) => {
  return axios.request({
    url: '/domain/list',
    data,
    method: 'post'
  })
}
export const domainSave = (data) => {
  return axios.request({
    url: '/domain/save',
    data,
    method: 'post'
  })
}
export const domainUpdateDomain = (data) => {
  return axios.request({
    url: '/domain/updateDomain',
    data,
    method: 'post'
  })
}

// 后台管理-前端用户接口 : PortalUserApi
export const portalUserDelete = ( data ) => {
  return axios.request({
    url: '/portalUser/delete?id=' + data,
    method: 'post'
  })
}
export const portalUserList = ( data ) => {
  return axios.request({
    url: '/portalUser/list',
    data,
    method: 'post'
  })
}
export const portalUserSave = ({
  pageNo,
  pageSize
}) => {
  const data = {
    pageNo,
    pageSize
  }
  return axios.request({
    url: '/portalUser/save',
    data,
    method: 'post'
  })
}

// 后台管理-合作信息接口 : CooperateApi
export const cooperateDelete = ( data ) => {
  return axios.request({
    url: '/cooperate/delete?id=' + data,
    data,
    method: 'post'
  })
}
export const cooperateList = ( data ) => {
  return axios.request({
    url: '/cooperate/list',
    data,
    method: 'post'
  })
}
export const cooperateSave = ( data ) => {
  return axios.request({
    url: '/cooperate/save',
    data,
    method: 'post'
  })
}

// 后台管理-行业门类接口 : IndustryApi
export const industryDelete = ( data ) => {
  return axios.request({
    url: '/industry/delete?id=' + data,
    data,
    method: 'post'
  })
}
export const industryGetIndustryList = (id) => {
  return axios.request({
    url: '/industry/getIndustryList',
    params: {
      id
    },
    method: 'get'
  })
}
export const industryList = ( data ) => {
  return axios.request({
    url: '/industry/list',
    data,
    method: 'post'
  })
}
export const industrySave = ( data ) => {
  return axios.request({
    url: '/industry/save',
    data,
    method: 'post'
  })
}

// 后台管理-投融资接口 : PartnerApi
export const partnerDelete = ( data ) => {
  return axios.request({
    url: '/partner/delete?id=' + data,
    data,
    method: 'post'
  })
}
export const partnerList = ( data ) => {
  return axios.request({
    url: '/partner/list',
    data,
    method: 'post'
  })
}
export const partnerSave = ( data ) => {
  return axios.request({
    url: '/partner/save',
    data,
    method: 'post'
  })
}