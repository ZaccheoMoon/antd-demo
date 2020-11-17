import React, { useState } from 'react'

export interface ICountDownProps {
  target?: number
  formalText?: string
  countDownText?: string
  onClick?: () => any
  onEnd?: () => void
}

const LODASH = require('lodash')

const CountDown: React.FC<ICountDownProps> = ({ target = 60, formalText = '获取验证码', countDownText = '重新发送', onClick = () => {}, onEnd = () => {} }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)

  const click = LODASH.debounce(async () => {
    try {
      await onClick()
    } catch(e) {
      return
    }
    setIsRunning(true)
  }, 500)

  if (isRunning) {
    let num = 0
    const countInterVal = setInterval(() => {
      if (target - num >= 0) {
        setCount(target - num)
        num += 1
        return
      }
      clearInterval(countInterVal)
      onEnd()
    }, 1000)
    setIsRunning(false)
  }

  return (
    <a
      aria-disabled={ count !== 0 }
      style={{
        color: count !== 0 ? '#d9d9d9' : '#C8001D',
        pointerEvents: count !== 0 ? 'none' : 'auto'
      }}
      onClick={ click }
    >{ count !== 0 ? `${countDownText}（${count}）` : formalText}</a>
  )
}

export default CountDown