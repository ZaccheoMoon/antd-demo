import React from 'react'
import { BasicLayoutProps, Settings as LayoutSettings, MenuDataItem } from '@ant-design/pro-layout'
import { notification, Breadcrumb } from 'antd'
import { history, RequestConfig, Link } from 'umi'
import RightContent from '@/components/RightContent'
import { menuToFlatMenu } from './utils/utils'
import Footer from '@/components/Footer'
import { ResponseError, OnionMiddleware } from 'umi-request'
import { getPageQuery } from '@/utils/utils'
import { stringify } from 'querystring'
import defaultSettings from '../config/defaultSettings'
import logo from './assets/logo.png'

export interface IBreadCrumbRoute {
  breadcrumbName: string
  path: string
  component: any
}

export interface IInitialState {
  currentUser?: any
  menuData?: MenuDataItem[]
  permissionBtnData?: string[]
  settings?: LayoutSettings
}

const menuToPermissionBtnData = (menuData: MenuDataItem[]): string[] => { // 将接口中返回的菜单数组中的按钮权限的标识值统一转成一维数组
  let arr: string[] = []
  menuData.forEach((item: MenuDataItem) => {
    if (item.permissions && Object.prototype.toString.call(item.permissions) === '[object Array]' && item.permissions.length !== 0) {
      arr = arr.concat(item.permissions)
    }
    if (item.children && Object.prototype.toString.call(item.children) === '[object Array]' && item.children.length !== 0) {
      const childrenPermissions = menuToPermissionBtnData(item.children)
      arr = arr.concat(childrenPermissions)
    }
  })
  return arr
}

const menuFilter = (layoutMenu: MenuDataItem[], dataMenu: MenuDataItem[]): MenuDataItem[] => {
  const arr: MenuDataItem[] = []
  layoutMenu.forEach((item: MenuDataItem) => {
    const menuResults = dataMenu.find(dataMenuItem => dataMenuItem.url === item.path)
    if (menuResults || item.path === '/home') {
      let children: MenuDataItem[] = []
      if (item.children && Object.prototype.toString.call(item.children) === '[object Array]' && item.children.length !== 0) {
        children = menuFilter(item.children, menuResults?.children ?? [])
      }
      arr.push(children.length === 0 ? item : { ...item, children })
    }
  })
  return arr
}

const menuHidden = (menu: MenuDataItem[]): MenuDataItem[] => {
  const arr: MenuDataItem[] = []
  menu.forEach(item => {
    if (!item.hidden) {
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        const newChildren = menuHidden(item.children)
        Reflect.set(item, 'children', newChildren)
      }
      arr.push(item)
    }
  })
  return arr
}

export async function getInitialState(): Promise<IInitialState> {
  return {
    settings: defaultSettings,
  }
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: any; menuData?: MenuDataItem[]; permissionBtnData?: string[] }
}): BasicLayoutProps => {
  let breadCrumbData: IBreadCrumbRoute[] = [] // 面包屑数据存放

  return {
    logo: <img src={ logo } alt="" />,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    headerContentRender: () => (
      <Breadcrumb style={{ display: 'inline-block', paddingLeft: '10px' }}>
        <Breadcrumb.Item><Link to="/">{ defaultSettings.title }</Link></Breadcrumb.Item>
        { breadCrumbData.map((item: IBreadCrumbRoute) => <Breadcrumb.Item key={item.path}><Link to={item.path}>{ item.breadcrumbName }</Link></Breadcrumb.Item>) }
      </Breadcrumb>
    ),
    breadcrumbRender: (route) => {
      breadCrumbData = route as IBreadCrumbRoute[] ?? []
      return route
    },
    postMenuData: (menuData?: MenuDataItem[]): MenuDataItem[] => menuData ? menuHidden(menuData) : [],
    footerRender: () => <Footer />,
    menuHeaderRender: undefined,
    ...initialState?.settings,
  }
}

/**
 * 网络请求设置
 */

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

const getRequestId = (channelId: string, randomLength: number, length: number): string => {
  const rand: string = Number(Math.random().toString().substr(3, randomLength)).toString(36)
  return (channelId + rand + Date.now() + rand).substr(0, length)
}

const loginOut = () => {}

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError & { responseCode?: string; responseMsg?: string; url?: string }) => {
  const { responseMsg, responseCode, url, response } = error

  if (responseMsg && responseCode && url) {
    if (responseCode === '000001') {
      loginOut()
    }
    notification.error({
      key: 'error',
      description: `${process.env.NODE_ENV === 'development' ? url : ''}${responseMsg}`,
      message: '请求失败'
    })
  } else if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText
    const { status, url: responseUrl } = response

    notification.error({
      key: 'error',
      message: `请求错误 ${status}: ${responseUrl}`,
      description: errorText,
    })
  } else {
    notification.error({
      key: 'error',
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    })
  }
  
  throw error
}

const middleware: OnionMiddleware = async (ctx, next) => {
  const { req: { options, url } } = ctx
  ctx.req.options = {
    ...options,
    headers: {
      ...options.headers,
      '_channel_id': '01',
      '_request_id': getRequestId('01', 36, 32)
    }
  }

  try {
    await next()
  } catch(e) {
    console.log('中间件错误', e)
  }

  const { res } = ctx
  if (res.responseCode !== '000000') {
    const obj = { ...res, url }
    throw obj
  }
  ctx.res = res.data ?? res
}

export const request: RequestConfig = {
  prefix: process.env.NODE_ENV === 'development' ? '/api' : process.env.urlPrefix,
  method: 'POST',
  middlewares: [middleware],
  credentials: 'include',
  errorHandler,
}
