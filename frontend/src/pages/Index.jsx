import React, { useContext } from 'react'
import { UserContext } from '../useContext'
import Sidebar from '../Components/Sidebar';
import Homepage from '../Components/Homepage';
import Login from '../Auth/Login';

const Index = () => {
    const {user} = useContext(UserContext);
    
   
  return (
    <>
    
   <div>
    {/* <Sidebar/> */}
    {!user && <Login/>}
    {user && <Homepage/>}
   </div>
   
    </>
  )
}

export default Index