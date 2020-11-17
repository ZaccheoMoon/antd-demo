// src/access.ts
import { IInitialState } from './app'

export default function access(initialState: IInitialState) {
  const { menuData } = initialState
  const menuPathArr = menuData?.map(item => item.url)
  return {
    hasMenu: (route: any) => menuPathArr ? menuPathArr.includes(route.path) : false
  }
}
