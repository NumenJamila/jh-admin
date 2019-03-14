// import Vue from 'vue'

const state = {
  userinfo: {}, // 基本信息
  systemMenu: {}, // 菜单
  jurisdictionList: [], // 权限
  isloading: false,
  returnStatus: false,
  bbsuserinfo: {} // 社区用户信息
}

const mutations = {
  setUserInfo: function (state, data) {
    // for(let i in data.menuList){
    //     data.menuList[i].isMouse=false
    //     data.menuList[i].isNone=true
    //     data.menuList[i].isLength=false
    //     for(let j in data.menuList[i].children){
    //         data.menuList[i].children[j].isHover=false
    //     }
    // }
    state.userinfo = data.user
    state.systemMenu = data.menuList
    // state.jurisdiction = data.oprKeyList;
    if (!data.isAdmin) {
      let o = {}
      for (var i in data.oprKeyList) {
        o[i] = true
      }
      state.jurisdictionList = o
      /// /console.log("权限:",state.jurisdictionList);
    } else {
      let o = []
      o['isAdmin'] = true
      state.jurisdictionList = o
    }
  },
  'setLoading': function (state, data) {
    state.isloading = data
  },
  'setReturnStatus': function (state, data) {
    state.returnStatus = data
  },
  'removeUserInfo': function (state, data) {
    state.userinfo = {}
    state.systemMenu = {}
  },
  'setBBSuserInfo': function (state, data) {
    state.bbsuserinfo = data
  }
}

const actions = {
  'setUserInfo': function (store, param) {
    return new Promise(function (resolve, reject) {
      store.commit('setUserInfo', param)
      resolve('ok')
    })
  },
  'setLoading': function (store, param) {
    return new Promise(function (resolve, reject) {
      store.commit('setLoading', param)
      resolve('ok')
    })
  },
  'setReturnStatus': function (store, param) {
    return new Promise(function (resolve, reject) {
      store.commit('setReturnStatus', param)
      resolve('ok')
    })
  },
  'removeUserInfo': function (store, param) {
    return new Promise(function (resolve, reject) {
      store.commit('removeUserInfo', param)
      resolve('ok')
    })
  },
  'setBBSuserInfo': function (store, param) {
    return new Promise(function (resolve, reject) {
      store.commit('setBBSuserInfo', param)
      resolve('ok')
    })
  }
}
const getters = {
  getUserInfo: function (state) {
    return state.userinfo
  },
  getBBSuserInfo: function (state) {
    return state.bbsuserinfo
  },
  getSystemMenu: function (state) {
    return state.systemMenu
  },
  getLoading: function (state) {
    return state.isloading
  },
  returnStatus: function (state) {
    return state.returnStatus
  },
  jurisdiction: function (state) {
    return state.jurisdictionList
  }

}

export default {
  state,
  mutations,
  actions,
  getters
}
