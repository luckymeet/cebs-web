import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1 Detail see:
 * https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true if set true, will always show the root menu if not set
 * alwaysShow, when item has more than one children route, it will becomes
 * nested mode, otherwise not show the root menu redirect: noRedirect if set
 * noRedirect will no redirect in the breadcrumb name:'router-name' the name is
 * used by <keep-alive> (must set!!!) meta : { roles: ['admin','editor'] control
 * the page roles (you can set multiple roles) title: 'title' the name show in
 * sidebar and breadcrumb (recommend set) icon: 'svg-name' the icon show in the
 * sidebar noCache: true if set true, the page will no be cached(default is
 * false) affix: true if set true, the tag will affix in the tags-view
 * breadcrumb: false if set false, the item will hidden in breadcrumb(default is
 * true) activeMenu: '/example/list' if set path, the sidebar will highlight the
 * path you set }
 */

/**
 * constantRoutes a base page that does not have permission requirements all
 * roles can be accessed
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }

  //  {
  //    path: '/guide',
  //    component: Layout,
  //    redirect: '/guide/index',
  //    children: [
  //      {
  //        path: 'index',
  //        component: () => import('@/views/guide/index'),
  //        name: 'Guide',
  //        meta: { title: 'Guide', icon: 'guide', noCache: true }
  //      }
  //    ]
  //  },
  //  {
  //    path: '/profile',
  //    component: Layout,
  //    redirect: '/profile/index',
  //    hidden: true,
  //    children: [
  //      {
  //        path: 'index',
  //        component: () => import('@/views/profile/index'),
  //        name: 'Profile',
  //        meta: { title: 'Profile', icon: 'user', noCache: true }
  //      }
  //    ]
  //  }
]

/**
 * asyncRoutes the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: '首页',
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    children: [{
      path: 'user',
      component: () => import('@/views/sys/user/list'),
      name: '用户管理',
      meta: { title: '用户管理', icon: 'user', perms: ['sys:user:list'] }
    }]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/article',
    children: [{
        path: 'article/list',
        component: () => import('@/views/info/article/list'),
        name: '文章管理',
        meta: { title: '文章管理', icon: 'user', perms: ['info:article:list'] }
      },
      {
        path: 'article/create',
        component: () => import('@/views/info/article/create'),
        hidden: true
      },
      {
        path: 'article/edit/:id(\\d+)',
        component: () => import('@/views/info/article/edit'),
        hidden: true
      },
      {
        path: 'article/view/:id(\\d+)',
        component: () => import('@/views/info/article/view'),
        hidden: true
      }
    ]
  },
  /*  {
      path: '/example',
      component: Layout,
      redirect: '/example/list',
      name: 'Example',
      meta: {
        title: 'Example',
        icon: 'example'
      },
      children: [{
          path: 'create',
          component: () => import('@/views/example/create'),
          name: 'CreateArticle',
          meta: { title: 'Create Article', icon: 'edit' }
        },
        {
          path: 'edit/:id(\\d+)',
          component: () => import('@/views/example/edit'),
          name: 'EditArticle',
          meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
          hidden: true
        },
        {
          path: 'list',
          component: () => import('@/views/example/list'),
          name: 'ArticleList',
          meta: { title: 'Article List', icon: 'list' }
        }
      ]
    },*/
  /*  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },*/

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see:
// https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
