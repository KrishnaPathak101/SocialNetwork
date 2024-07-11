import { useState } from 'react'
import { Route, Routes } from 'react-router'
import LoginComponent from './Auth/Login'
import Signup from './Auth/Signup'
import Index from './pages/Index'
import { UserContextProvider } from './useContext'
import Login from './Auth/Login'
import Homepage from './Components/Homepage'
import Profile from './pages/profile'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/:subpage' element={<Homepage />} />
        <Route path= '/login' element={<Login/>} />
        <Route path="/:subpage/:userId" element={<Homepage/>} />

        <Route path='/signup' element={<Signup />} />
      </Routes>
      </UserContextProvider>
    </>
  )
}

export default App
