import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      // hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        // hideInMenu: true,
        title: '首页',
        notCache: true,
        icon: 'md-home'
      },
      component: () => import('@/view/single-page/home')
    }]
  },
  //富文本页面
  {
    path: '/contents',
    name: 'contents',
    meta: {
      icon: 'md-clipboard',
      title: '内容管理'
    },
    component: Main,
    children: [
      {
        path: '/contentList',
        name: 'contentList',
        meta: {
          icon: 'logo-buffer',
          title: '内容列表'
        },
        component: () => import('@/view/contents/contentList.vue')
      },
      {
        path: '/addContent',
        name: 'addContent',
        meta: {
          icon: 'md-color-palette',
          title: '文本内容'
        },
        component: () => import('@/view/contents/addContent.vue')
      }
    ]
  },
  //系统管理
  {
    path: '/systemManagement',
    name: 'systemManagement',
    meta: {
      icon: 'md-cog',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'roleManagement',
        name: 'roleManagement',
        meta: {
          icon: 'ios-git-compare',
          title: '角色管理'
        },
        component: () => import('@/view/systemManagement/roleManagement.vue')
      },
      {
        path: 'menuManagement',
        name: 'menuManagement',
        meta: {
          icon: 'md-menu',
          title: '菜单管理'
        },
        component: () => import('@/view/systemManagement/menuManagement.vue')
      },
      {
        path: 'permission',
        name: 'permission',
        meta: {
          icon: 'ios-color-filter',
          title: '权限管理'
        },
        component: () => import('@/view/systemManagement/permission.vue')
      },
      {
        path: 'job',
        name: 'job',
        meta: {
          icon: 'md-alarm',
          title: '任务管理'
        },
        component: () => import('@/view/systemManagement/job.vue')
      },
      {
        path: 'userManagement',
        name: 'userManagement',
        meta: {
          icon: 'md-contacts',
          title: '用户管理'
        },
        component: () => import('@/view/systemManagement/userManagement.vue')
      },
      {
        path: 'personal',
        name: 'personal',
        meta: {
          icon: 'md-person',
          title: '个人信息'
        },
        component: () => import('@/view/systemManagement/personal.vue')
      },
      {
        path: 'upLoadFiles',
        name: 'upLoadFiles',
        meta: {
          icon: 'ios-cloud-upload-outline',
          title: '文件上传'
        },
        component: () => import('@/view/systemManagement/upLoadFiles.vue')
      }
    ]
  },
  //评价管理
  {
    path: '/appraise',
    name: 'appraise',
    meta: {
      icon: 'md-cog',
      title: '评价管理'
    },
    component: Main,
    children: [
      {
        path: 'appraiseConfig',
        name: 'appraiseConfig',
        meta: {
          icon: 'ios-git-compare',
          title: '计算配置'
        },
        component: () => import('@/view/appraise/appraiseConfig/appraiseConfig.vue')
      },
      {
        path: 'appraiseCompany',
        name: 'appraiseCompany',
        meta: {
          icon: 'ios-git-compare',
          title: '企业管理'
        },
        component: () => import('@/view/appraise/appraiseCompany/appraiseCompany.vue')
      }
    ]
  },
  //配置管理
  {
    path: '/manageConfig',
    name: 'manageConfig',
    meta: {
      icon: 'md-cog',
      title: '评价管理'
    },
    component: Main,
    children: [
      {
        path: 'industry',
        name: 'industry',
        meta: {
          icon: 'ios-git-compare',
          title: '行业门类'
        },
        component: () => import('@/view/manageConfig/industry/industry.vue')
      },
      {
        path: 'enterprise',
        name: 'enterprise',
        meta: {
          icon: 'ios-git-compare',
          title: '企业标签'
        },
        component: () => import('@/view/manageConfig/enterprise/enterprise.vue')
      }
    ]
  },
  //关系管理
  {
    path: '/relevance',
    name: 'relevance',
    meta: {
      icon: 'md-cog',
      title: '评价管理'
    },
    component: Main,
    children: [
      {
        path: 'cooperate',
        name: 'cooperate',
        meta: {
          icon: 'ios-git-compare',
          title: '行业门类'
        },
        component: () => import('@/view/relevance/cooperate/cooperate.vue')
      },
      {
        path: 'financing',
        name: 'financing',
        meta: {
          icon: 'ios-git-compare',
          title: '企业标签'
        },
        component: () => import('@/view/relevance/financing/financing.vue')
      }
    ]
  },
  //资源管理
  {
    path: '/resource',
    name: 'resource',
    meta: {
      icon: 'md-cog',
      title: '评价管理'
    },
    component: Main,
    children: [
      {
        path: 'company',
        name: 'company',
        meta: {
          icon: 'ios-git-compare',
          title: '企业管理'
        },
        component: () => import('@/view/resource/company/company.vue')
      },
      {
        path: 'domain',
        name: 'domain',
        meta: {
          icon: 'ios-git-compare',
          title: '产业管理'
        },
        component: () => import('@/view/resource/domain/domain.vue')
      }
    ]
  },
  //信息管理
  {
    path: '/userManage',
    name: 'userManage',
    meta: {
      icon: 'md-cog',
      title: '信息管理'
    },
    component: Main,
    children: [
      {
        path: 'collectHistory',
        name: 'collectHistory',
        meta: {
          icon: 'ios-git-compare',
          title: '收藏历史'
        },
        component: () => import('@/view/userManage/collectHistory/collectHistory.vue')
      },
      {
        path: 'browseHistory',
        name: 'browseHistory',
        meta: {
          icon: 'ios-git-compare',
          title: '浏览历史'
        },
        component: () => import('@/view/userManage/browseHistory/browseHistory.vue')
      },
      {
        path: 'reUser',
        name: 'reUser',
        meta: {
          icon: 'ios-git-compare',
          title: '登录用户'
        },
        component: () => import('@/view/userManage/reUser/reUser.vue')
      }
    ]
  },
  // 错误页面
  {
    path: '/error',
    name: 'error',
    component: Main,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '/401',
        name: 'error_401',
        meta: {
          hideInMenu: true,
          title: '无权限'
        },
        component: () => import('@/view/error-page/401.vue')
      }
    ]
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true,
      title: '网络异常'
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '/numen',
    name: 'numen',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/contents/numen.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }  
]
