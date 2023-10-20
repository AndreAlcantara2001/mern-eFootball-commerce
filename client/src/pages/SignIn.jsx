
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure
} from '../redux/user/userSlice'

const SignIn = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success === false) {
        dispatch(signInFailure(data.message))

        return;
      }
      dispatch(signInSuccess(data))

      navigate('/')// navigate to posts or sth

    } catch (err) {
      dispatch(signInFailure(signInFailure(err.message)))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign In</h1>

      <form onSubmit={handleOnSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleOnChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleOnChange} />

        <button disabled={loading} className='bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-75'>
          {loading ? 'Loading...' : 'Sign In'}</button>
      </form>

      <div className='flex mt-5 gap-2'>
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}><span className='text-blue-700 font-semibold'>Sign up</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn