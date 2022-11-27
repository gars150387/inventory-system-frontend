import React from 'react'
import { Login } from '../authentication/Login'
import '../style/page/Home.css'

export const Home = () => {
  return (
    <div className='container-home-page'>
        <h1>Home</h1>
        <div>
            <Login />
        </div>
    </div>
  )
}
