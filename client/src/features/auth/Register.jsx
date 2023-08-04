import { useState, useEffect, useRef } from "react";
import { useDispatch,useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { toast} from 'react-toastify'
import Spinner from "../../components/Spinner";
import { useRegisterMutation } from "../users/usersApiSlice";
import { setCredentials } from "./authSlice";

import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function RegisterScreen() {

    const userRef = useRef();
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [userName, setUserName] = useState('')
    const [validName, setValidName] = useState(false)
    const [userFocus, setuserFocus] = useState(false)

    const [password,setPassword] = useState('')
    const [validPassword, setvalidPassword] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)

    const [confirmPassword,setConfirmPassword] = useState('')
    const [validConfirmPassword, setValidConfirmPassword] = useState(false)
    const [confirmPasswordFocus,setConfirmPasswordFocus] = useState(false)


    const { userInfo } = useSelector( (state) => state.auth )
    const [ register, { isLoading } ] = useRegisterMutation()

    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(userName));
    }, [userName])

    useEffect(() => {
        setvalidPassword(PWD_REGEX.test(password));
        setValidConfirmPassword(password === confirmPassword);
    }, [password, confirmPassword])

    useEffect(()=> {
        if(userInfo){
            navigate('/login')
        }
    },[navigate,userInfo])

    const handleSubmit =  async (e)=> {
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error('Passwords do not match!')
        }else{
            try {
                const userdata = await register({ 
                    username:userName,
                    password
                 }).unwrap()
                 //dispatch(setCredentials({...userdata}))
                 toast.success('Registration complete.')
                 navigate('/login')
            } catch (err) {
                if (!err?.response) {
                    toast.error('No Server Response');
                } else if (err.response?.status === 409) {
                    toast.error('Username Taken');
                } else{
                    toast.error(err?.data?.message || err.error );
                }
            }
        }
    }
  return (
    <section>
        <h1>Register</h1>
        { isLoading && <Spinner/> }
        <form className="form-container" onSubmit={handleSubmit} >

            <div className="form-item">
                <label 
                    htmlFor="username"
                >
                    Enter your username: 
                    <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validName || !userName ? "hide" : "invalid"} />
                </label>
                <input 
                    type="text" 
                    name="username" 
                    id="username"
                    placeholder="Enter your username here"
                    ref={userRef}
                    autoComplete="on"
                    value={ userName }
                    aria-invalid={validName ? "false" : "true"}
                    onChange={ (e)=> setUserName(e.target.value) }
                    onFocus={() => setuserFocus(true)}
                    onBlur={() => setuserFocus(false)}
                    required 
                />
                <p 
                    id="uidnote" 
                    className={userFocus && userName && !validName ? "btn-outline-info" : "offscreen"}
                >
                    <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters.<br />
                    Must begin with a letter.<br />
                    Letters, numbers, underscores, hyphens allowed.
                </p>
            </div>

            <div className="form-item">
                <label 
                    htmlFor="password"
                >
                    Enter your password: 
                    <FontAwesomeIcon 
                        icon={faCheck} 
                        className={validPassword ? "valid" : "hide"} 
                    />
                    <FontAwesomeIcon 
                        icon={faTimes} 
                        className={validPassword || !password ? "hide" : "invalid"} 
                    />
                </label>
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="Enter your password here"
                    autoComplete="on"
                    aria-invalid={validPassword ? "false" : "true"}
                    aria-describedby="pwdnote"
                    value={ password }
                    onChange={ (e)=> setPassword(e.target.value) }
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                    required 
                />
                <p 
                    id="pwdnote" 
                    className={passwordFocus && !validPassword ? "instructions" : "offscreen"}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: 
                    <span aria-label="exclamation mark">!</span> 
                    <span aria-label="at symbol">@</span> 
                    <span aria-label="hashtag">#</span> 
                    <span aria-label="dollar sign">$</span> 
                    <span aria-label="percent">%</span>
                </p>
            </div>

            <div className="form-item">
                <label 
                    htmlFor="confirmPassword"
                >
                    Confirm your password:
                    <FontAwesomeIcon 
                        icon={faCheck} 
                        className={validConfirmPassword && confirmPassword ? "valid" : "hide"} 
                    />
                    <FontAwesomeIcon 
                        icon={faTimes} 
                        className={validConfirmPassword || !confirmPassword ? "hide" : "invalid"} 
                    />
                </label>
                <input 
                    type="password"
                    id="confirmPassword"
                    placeholder="Retype your password here"
                    value={ confirmPassword }
                    required
                    onChange={ (e)=> setConfirmPassword(e.target.value) }
                    aria-invalid={confirmPassword ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setConfirmPasswordFocus(true)}
                    onBlur={() => setConfirmPasswordFocus(false)} 
                />
                <p 
                    id="confirmnote" 
                    className={confirmPasswordFocus && !validConfirmPassword ? "instructions" : "offscreen"}
                >
                    <FontAwesomeIcon icon={faInfoCircle} /> Must match the first password input field.
                </p>
            </div>

            <button type="submit">Login</button>
            <p>New user? <Link to='/register'>Register here.</Link></p>
        </form>
    </section>
  )
}

export default RegisterScreen