import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Intro from './components/Intro'


import RequireAuth from './features/auth/RequireAuth'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import Lobby from './components/Lobby'
import SitAndGo from './components/SitAndGo'

import Mockups from './components/mockups/mockups'

const App = () => {
  return(
    <Routes>
      <Route path='/' element={<Layout/>}>
       
        {/* public routes */}
        <Route index={true} element={<Intro/>}/>
        <Route path='mockups' element={<Mockups/>}/>

        <Route path='login' element={<Login/>} />
        <Route path='register' element={<Register/>} />
        <Route path='lobby/*' element={<Lobby/>}>
          <Route path='sitandgo' element={<SitAndGo />} />
          <Route path='chat'  />
        </Route>
        
        {/* protected routes */}
        
      </Route>
    </Routes>
  )
}

export default App