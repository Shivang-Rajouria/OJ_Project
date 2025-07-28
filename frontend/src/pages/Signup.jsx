import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import '../styles/AuthForm.css'

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signup(formData)
      alert('Signup successful!')
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup failed')
    }
  }

  return (
    <div className="auth-container">
      <h1>Signup for BranchBench</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>

      <div className="auth-footer">
        Already have an account? <button onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  )
}
