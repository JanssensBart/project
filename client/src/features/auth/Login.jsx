import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch,useSelector } from 'react-redux'
import { useLoginMutation } from '../users/usersApiSlice'
import { setCredentials } from "./authSlice";
import { toast} from 'react-toastify'
import Spinner from "../../components/Spinner"


function LoginScreen() {

    const userRef = useRef()
    
    const [ login, { isLoading } ] = useLoginMutation()
    
    const { userInfo } = useSelector( (state) => state.auth )
    const distpatch = useDispatch()
    const navigate = useNavigate()

    const [userName, setUserName] = useState('')
    const [password,setPassword] = useState('')
    

    useEffect(()=>{userRef.current.focus()},[])

    useEffect(()=> {
        if(userInfo){
            navigate('/lobby')
        }
    },[navigate,userInfo])


    const handleSubmit = async (e)=> {
        e.preventDefault()
        try {

            const userdata = await login({ 
                username:userName,
                password
             }).unwrap()

             distpatch(setCredentials({...userdata, userInfo}))

             setUserName('')
             setPassword('')

             navigate('/')

        } catch (err) {
            
            if (err.status === 'FETCH_ERROR') {toast.error('Server not responding')}
            else {toast.error(err?.data?.message || err.error)}

        }
    }

  return (
    
      <section>
        <h1>Login</h1>
        { isLoading && <Spinner/> }
        <form className="form-container" onSubmit={handleSubmit} >

            <div className="form-item">
                <label 
                    htmlFor="username"
                >
                    Enter your username: 
                </label>
                <input 
                    type="text" 
                    name="username" 
                    id="username"
                    placeholder="Enter your username here"
                    ref={userRef}
                    autoComplete="on"
                    value={ userName }
                    onChange={ (e)=> setUserName(e.target.value) }
                    required 
                />
            </div>

            <div className="form-item">
                <label 
                    htmlFor="password"
                >
                    Enter your password: 
                </label>
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="Enter your password here"
                    autoComplete="on"
                    value={ password }
                    onChange={ (e)=> setPassword(e.target.value) }
                    required 
                />
            </div>

            <button type="submit">Login</button>
            <p>New user? <Link to='/register'>Register here.</Link></p>
        </form>
      </section>
  )
}

export default LoginScreen