import { Settings as LayoutSettings } from '@ant-design/pro-layout'

export default {
  navTheme: 'dark',
  primaryColor: '#C8001D',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: '基础平台',
  pwa: false,
  iconfontUrl: '',
  name: '基础平台',
} as LayoutSettings & {
  pwa: boolean
}
