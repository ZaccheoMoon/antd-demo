import { defineConfig } from 'umi'
import defaultSettings from './defaultSettings'
import routes from './route'

export default defineConfig({
  define: {
    "process.env.urlPrefix": 'http://www.baidu.com'
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: '基础平台',
    locale: true,
    siderWidth: 208,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
    chrome: 79,
    firefox: 82,
    safari: 11,
    edge: false,
    ios: false,
  },
  routes: routes,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
})
