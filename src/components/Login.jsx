import React, {useState, useEffect, useContext} from 'react'
import { useForm } from 'react-hook-form';
import { UserContext } from '../context/UserContext'
import backgroundImg from '../background.jpg'
import { useLocation } from "wouter";
import axios from 'axios';

const Login = () => {
  const [formError, setFormError] = useState(false);
  const { user, setUser } = useContext(UserContext)
  const [location, setLocation] = useLocation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitSuccessful },
    setError
  } = useForm({});

  useEffect(() => {
    if(isSubmitSuccessful) {
      const values = getValues();

      axios({
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: 'https://ronald-exam-api.herokuapp.com/login',
        data:{"user":{
          "email": values.email,
          "password": values.password
          }
        }
      })
      .then((res) => {
        console.log(res)
        const userData = {
          id: res.data.user.id,
          email: res.data.user.email,
          token: res.headers.authorization,
          role: res.data.user.role,
        }
        setUser(userData)
        setLocation('/user_list')
      })
    }
  },[isSubmitSuccessful])

  const handleLogin = (data) => {
    console.log(data)
  }


  return (
    <div className='w-full h-screen flex'>
        <div className='grid grid-cols-1 md:grid-cols-2 m-auto h-[650px] shadow-lg shadow-gray-600 sm:max-w-[900px] rounded'>
            <div className='w-full h-[650px] hidden md:block'>
                <img className='w-full h-full rounded' src={backgroundImg} alt="/" />
            </div>
            <div className='p-4 flex flex-col justify-around'>
            <form className='max-w-[400px] w-full mx-auto bg-white p-4' onSubmit={handleSubmit(handleLogin)}>
                <div className='flex flex-col py-2'>
                    <input 
                    className='border p-2 rounded-md' 
                    type="text" 
                    placeholder='Email'
                    {...register("email", { required: "This is required" })}
                    />
                    <span className='text-red-600'>{errors.email?.message}</span>
                </div>
                <div className='flex flex-col py-2'>
                    <input 
                    className='border p-2 rounded-md' 
                    type="password" 
                    placeholder='Password' 
                    {...register("password", { required: "This is required" })}
                    />
                    <span className='text-red-600'>{errors.password?.message}</span>
                </div>
                <button className='border w-full my-5 py-2 bg-emerald-600 hover:bg-emerald-300 text-white rounded-md'>Login</button>
            </form>
            </div>
        </div>
    </div>
  ) 
}

export default Login
