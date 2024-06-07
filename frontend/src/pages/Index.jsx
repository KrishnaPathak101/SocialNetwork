import React, { useContext } from 'react'
import { UserContext } from '../useContext'
import Sidebar from '../Components/Sidebar';
import Homepage from '../Components/Homepage';

const Index = () => {
    const {user} = useContext(UserContext);
    
   
  return (
    <>
    
   <div>
    {/* <Sidebar/> */}
    <Homepage/>
   </div>
   
    </>
  )
}

export default Index