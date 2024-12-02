import React, { useEffect } from 'react'
import {Navigate, Route, Routes} from "react-router-dom"

import NavBar from "./components/NavBar.jsx"
import Home from "./components/Home.jsx"
import SignUp from "./components/SignUp.jsx"
import Login from "./components/Login.jsx"
import Settings from "./components/Settings.jsx"
import UserProfile from "./components/UserProfile.jsx"
import { useAuthStore } from './store/useAuthStore.js'
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast";
import {useThemeStore} from "./store/useThemeStore.js"

const App = () => {

  const {checkAuth, authUser, isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();

  useEffect( () => {
    checkAuth();
  }, [checkAuth])

  console.log({authUser});

  if(isCheckingAuth && !authUser){

    return (
  
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    
    );
  }

  return (
    <div data-theme = {theme}>
      

      <NavBar/>

      <Routes>

        <Route path='/' element={authUser ? <Home/> : <Navigate to="/login"/>}/>
        <Route path='/signup' element={!authUser ? <SignUp/> : <Navigate to = "/"/>}/>
        <Route path='/login' element={!authUser ? <Login/> : <Navigate to = "/"/> }/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/profile' element={authUser ? <UserProfile/> : <Navigate to = "/login"/>}/>

      </Routes>
      

      <Toaster  
        position="top-center"
        reverseOrder={false}
      />
    
    </div>
  )
}

export default App
