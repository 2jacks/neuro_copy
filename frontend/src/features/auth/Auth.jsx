import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { fakeCredentials } from './fakeAuth'

import { Input, Button } from 'antd'

function Auth() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onClick = () => {
    if (
      username === fakeCredentials.username &&
      password === fakeCredentials.password
    ) {
      localStorage.setItem('user', JSON.stringify({ username, password }))
      navigate('/')
    }
  }

  return (
    <div>
      <Input
        placeholder={'Пользователь'}
        value={username}
        onChange={e => {
          setUsername(e.target.value)
        }}
      />
      <Input
        placeholder={'Пароль'}
        value={password}
        onChange={e => {
          setPassword(e.target.value)
        }}
      />
      <Button onClick={onClick}>Войти</Button>
    </div>
  )
}

export default Auth
