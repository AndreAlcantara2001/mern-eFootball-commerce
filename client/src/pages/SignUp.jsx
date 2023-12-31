
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OAuth } from '../components/OAuth';


const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success === false) {
        setLoading(false)
        setError(data.message)

        return;
      }
      setLoading(false);
      setError(null)
      console.log(data)

      navigate('/sign-in')

    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign Up</h1>

      <form onSubmit={handleOnSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleOnChange} />
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleOnChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleOnChange} />

        <button disabled={loading} className='bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-75'>
          {loading ? 'Loading...' : 'Sign Up'}</button>
        <OAuth />
      </form>

      <div className='flex mt-5 gap-2'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}><span className='text-blue-700 font-semibold'>Sign in</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignUp