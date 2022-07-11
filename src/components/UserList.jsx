import React, { useEffect, useContext } from 'react'
import Table, { AvatarCell, StatusPill } from './Table'
import { UserContext } from '../context/UserContext'
import { ItemContext } from '../context/ItemContext'
import { useState } from 'react';
import userIcon from '../user.png'
import axios from 'axios';
import { useLocation } from "wouter";
import EditUser from './EditUser';
import { ToastContainer, toast } from "react-toastify";
import AddUser from './AddUser';

const UserList = () => {
  const [users, setUsers] = useState([])
  const [selectedRows, setSelectedData] = useState([])
  const [location, setLocation, Redirect] = useLocation();
  const [isEdittingUser, setIsEdittingUser] = useState(false)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [reRender, setReRender] = useState(true)

  const { user } = useContext(UserContext)
  const { item, setItem } = useContext(ItemContext)

  const setToast = () => {
    toast.error("Unauthorized user!", {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      });
  }

  const handleLogout = () => {
    setUsers(null)
    setLocation('/login')
  }

  const handleEditClick = (row) => {
    setItem(row.original)
    setIsEdittingUser(true)
  }

  const handleRegister = () => {
    setIsAddingUser(true)
  }

  const handleDeleteClick = (row) => {
    axios({
      method: 'delete',
      url: `https://ronald-exam-api.herokuapp.com/user/${row.original.id}`,
      headers: {
        'Authorization': ` ${user.token}`
      }
    }).then((res) => {
      console.log(res)
      setReRender(!!reRender)
      toast.error(`${row.original.name} is removed!`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        });
    },[])
  }

  const onSelectedRows = rows => {
    const mappedRows = rows.map(r => r.original);
    setSelectedData([...selectedRows, ...mappedRows]);
  };

  useEffect(() => {
    axios({
      method: 'get',
      url: 'https://ronald-exam-api.herokuapp.com/list',
      headers: {
        'Authorization': ` ${user.token}`
      }
    }).then((res) => {
      const list = res.data;
      const new_list = []
      list.map((item) => {
        const new_object = {
          ...item,
          imgAvatar: userIcon
        }
        new_list.push(new_object)
      })
      
      setUsers(new_list);
    })
  }, [reRender])

  const columns = React.useMemo(() => [ 
    {
      Header: "ID",
      accessor: 'id'
    },
    {
      Header: "User",
      accessor: 'name',
      Cell: AvatarCell,
      imgAccessor: "imgAvatar",
      emailAccessor: "email",
    },
    {
      Header: "Contact",
      accessor: 'phone_number',
    },
    {
      Header: "Position",
      accessor: 'role',
    },
    {
      id:"selection",
      Header: ({getToggleAllRowsSelectedProps }) =>(
        <div className='flex justify-end w-full'>
          <p></p>
        </div>
      ),
      Cell: ({row})=>(
        <div className='flex justify-end w-full'>
          {user.role === 'User' ?  
          <button 
          className ='bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-6 border border-gray-400 hover:border-transparent rounded-lg'
          onClick={() => setToast()}>
            Edit
          </button> : <button 
          className ='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-6 border border-blue-500 hover:border-transparent rounded-lg'
          onClick={() => handleEditClick(row)}>
            Edit
          </button>}
        </div>
      ),
    },
    {
      id:"selection2",
      Header: ({getToggleAllRowsSelectedProps }) =>(
        <div className='flex justify-end w-full'>
          <p></p>
        </div>
      ),
      Cell: ({row})=>(
        <div className='flex justify-center w-full'>
          {user.role === 'User' ? <button 
          className ='bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-6 border border-gray-400 hover:border-transparent rounded-lg'
          onClick={() => setToast()}>
            Delete
          </button> : <button 
          className ='bg-transparent hover:bg-emerald-500 text-emerald-700 font-semibold hover:text-white py-2 px-6 border border-emerald-500 hover:border-transparent rounded-lg'
          onClick={() => handleDeleteClick(row)}>
            Delete
          </button>}
        </div>
        
      ),
    }
  ], [])

  return (
    <>
      <div className='w-full h-screen bg-gray-100 overflow-hidden'>
        <div className="h-full w-full bg-gray-100 text-gray-900">
          <main className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 pt-{4}">
            <div className="flex flex-row justify-between pt-2">
              <h1 className="text-xl font-semibold"> USER LIST 📃</h1>
              <button className ='bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-6 border border-red-500 hover:border-transparent rounded-full' onClick={handleLogout}>Logout</button>
            </div>
            <div className="pt-5 px-20 h-full w-full">
              <Table onSelectedRows={onSelectedRows} columns={columns} data={users} label="Register User" handleClick={handleRegister} />
            </div>
          </main>
          <ToastContainer />
        </div>
      </div>
      {isEdittingUser && (
        <EditUser item={item} setIsEdittingUser={setIsEdittingUser} setReRender={setReRender} reRender={reRender}/>
      )}
      {isAddingUser && (
        <AddUser setIsAddingUser={setIsAddingUser} setReRender={setReRender} reRender={reRender} />
      )}
    </>
  )
}

export default UserList