import React, { useState, useEffect, useContext } from 'react'
import { ItemContext } from '../context/ItemContext';
import { UserContext } from '../context/UserContext'
import { useForm } from 'react-hook-form';
import { useLocation } from "wouter";
import axios from "axios";

const EditUser = ({ setIsEdittingUser, setReRender, reRender }) => {
  const { item, setItem } = useContext(ItemContext)
  const { user } = useContext(UserContext)
  const [location, setLocation] = useLocation()
  const [currentUser, setCurrentUser] = useState()

  const handleBack = () => {
    setItem(null)
    setIsEdittingUser(false)
  }

  const { 
    register, 
    handleSubmit, 
    getValues, 
    control,
    watch, 
    reset,
    formState: { errors, isSubmitSuccessful },
    setError
  } = useForm({
    defaultValues:{
      email: item.email,
      name: item.name,
      contactNumber: item.phone_number
    }
  });

  useEffect(() => {
    if(isSubmitSuccessful) {
      const values = getValues();

      axios({
        method: 'patch',
        headers: { 'Content-Type': 'application/json' },
        url: `https://ronald-exam-api.herokuapp.com/user/${item.id}`,
        headers: {
          'Authorization': ` ${user.token}`
        },
        data:{"user":{
          "email": values.email,
          "name": values.name,
          "phone_number": values.phone_number
          }
        }
      })
        .then((res) => {
          console.log(res)
          setIsEdittingUser(false)
          setItem(null)
          setReRender(!reRender)
        })
    }
  },[isSubmitSuccessful])

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-[600px] my-6 mx-auto">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[600px] bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                Edit User 🎉
              </h3>
            </div>
            <div className="relative p-2 flex-auto">
              <form 
                className='max-w-[500px] w-full mx-auto bg-white p-4 px-8 rounded-lg' 
                onSubmit={handleSubmit(onSubmit)}
                >
                  <div className='flex flex-col text-black py-2'>
                  <label className='black'>Email</label>
                  <input 
                    className='rounded-lg bg-gray-200 mt-2 p-2 focus:border-blue-500 focus:bg-gray-600 focus:outline-none focus:text-white' 
                    type="text" 
                    {...register("email", {required: "This is required"})}
                  />
                  <span className='text-red-600'>{errors.firstName?.message}</span>
                </div>
                <div className='flex flex-col text-black py-2'>
                  <label className='black'>Name</label>
                  <input 
                    className='rounded-lg bg-gray-200 mt-2 p-2 focus:border-blue-500 focus:bg-gray-600 focus:outline-none focus:text-white' 
                    type="text" 
                    {...register("name", {required: "This is required"})}
                  />
                  <span className='text-red-600'>{errors.firstName?.message}</span>
                </div>
                <div className='flex flex-col text-black py-2'>
                  <label className='black'>Contact Number</label>
                  <input 
                    className='rounded-lg bg-gray-200 mt-2 p-2 focus:border-blue-500 focus:bg-gray-600 focus:outline-none focus:text-white' 
                    type="text" 
                    {...register("contactNumber", {required: "This is required"})}
                  />
                  <span className='text-red-600'>{errors.middleName?.message}</span>
                </div>
                <button className='w-full my-5 py-2 bg-teal-500 shadow-lg shadw-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg' type='submit'>Edit</button>
              </form>
            </div>
            <div className="flex items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={(e) => handleBack(e)}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default EditUser