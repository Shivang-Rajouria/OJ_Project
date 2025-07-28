import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import '../styles/AuthForm.css'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login(formData)
      localStorage.setItem('token', res.data.token)
      alert('Login successful!')
      navigate('/contests')
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <div className="auth-container">
      <h1>Login to BranchBench</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      <div className="auth-footer">
        New here? <button onClick={() => navigate('/')}>Sign up</button>
      </div>
    </div>
  )
}
