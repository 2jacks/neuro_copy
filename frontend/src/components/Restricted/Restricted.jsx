import React, { useState, useEffect } from 'react'

import { fakeCredentials } from '@features/auth/fakeAuth'

import { useNavigate } from 'react-router-dom'

function Restricted({ children }) {
  const navigate = useNavigate()

  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'))

    if (
      user &&
      user.username === fakeCredentials.username &&
      user.password === fakeCredentials.password
    ) {
      setIsAuth(true)
    } else {
      navigate('/auth')
    }
  }, [])

  if (isAuth) {
    return children
  } else {
    return <div>Необходимо авторизоваться</div>
  }
}

export default Restricted
