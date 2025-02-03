import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const navigate = useNavigate()  // Hook to navigate programmatically

  const onChangeEmail = (event) => {
    setEmail(event.target.value)
  }

  const onChangePassword = (event) => {
    setPassword(event.target.value)
  }

  const onSuccessLogin = (jwtToken) => {
    navigate('/', { replace: true })
    Cookies.set('jwt_token', jwtToken, { expires: 30 })
  }

  const onLoginForm = async (event) => {
    event.preventDefault()
    const apiUrl = 'http://localhost:3000/login'
    const creds = { email, password }

    const options = {
      headers: {
        "Content-type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify(creds),
      credentials: "include",
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      onSuccessLogin(data.jwt_token)
    } else {
      setEmail('')
      setPassword('')
      setShowErrorMsg(true)
      setErrorMsg(data.error_msg)
    }
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Navigate to="/" />
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={onLoginForm}>
        <img
          className="login-page-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        <label className="login-label" htmlFor="email" value={email}>
          EMAIL
        </label>
        <input
          className="login-page-input-box"
          type="text"
          placeholder="Email"
          id="email"
          value={email}
          onChange={onChangeEmail}
        />
        <label className="login-label" htmlFor="password" value={password}>
          PASSWORD
        </label>
        <input
          className="login-page-input-box"
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={onChangePassword}
        />
        <button className="login-button" type="submit">
          Login
        </button>
        {showErrorMsg && <p className="login-error">*{errorMsg}</p>}
      </form>
    </div>
  )
}

export default Login
