import React from 'react'
import { Login } from '../authentication/Login'
import '../style/page/Home.css'

export const Home = () => {
  return (
    <div className='container-home-page'>
        <div>
            <Login />
        </div>
    </div>
  )
}
