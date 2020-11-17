import React, { useCallback } from 'react'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin } from 'antd'
import { history, useModel } from 'umi'
import { getPageQuery } from '@/utils/utils'
import { stringify } from 'querystring'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'

export interface GlobalHeaderRightProps {
  menu?: boolean
}

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState')

  const onMenuClick = useCallback(
    (event: {
      key: React.Key
      keyPath: React.Key[]
      item: React.ReactInstance
      domEvent: React.MouseEvent<HTMLElement>
    }) => {
      const { key } = event
      if (key === 'logout') {
        setInitialState({ ...initialState, currentUser: undefined })
        loginOut()
        return
      }
      history.push(key)
    },
    [],
  )

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  )

  if (!initialState) {
    return loading
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}></Menu>
  )
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size='small' className={styles.avatar}>测</Avatar>
        <span className={`${styles.name} anticon`}>测试</span>
      </span>
    </HeaderDropdown>
  )
}

export default AvatarDropdown
