import { useState, useEffect } from "react";
import { useDispatch,useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { toast} from 'react-toastify'
import Loader from "./Loader";
import { setCredentials } from "../features/auth/authSlice";
import { useUpdateUserMutation } from '../features/users/usersApiSlice'

function ProfileScreen() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [userName, setUserName] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')

    const { userInfo } = useSelector( (state) => state.auth )
    const [updateProfile, { isLoading }] = useUpdateUserMutation()

    useEffect(()=> {
        setUserName(userInfo.username) 
    },[userInfo.setUserName])

    const submitHandler =  async (e)=> {
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error('Passwords do not match!')
        }else{
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    username : userName,
                    password : password
                }).unwrap()
                dispatch(setCredentials({...res}))
                toast.success('Profile saved')
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    console.log(userInfo )
  return (
    <FormContainer>
        <h1>Update Profile</h1>
        <Form onSubmit={submitHandler} >
            <Form.Group className="my-2" controlId="username">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your username here"
                    value={ userName }
                    onChange={ (e)=> setUserName(e.target.value) }
                >
                </Form.Control>
            </Form.Group>
            <Form.Group className="my-2" controlId="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter your password here"
                    value={ password }
                    onChange={ (e)=> setPassword(e.target.value) }
                >
                </Form.Control>
            </Form.Group>
            <Form.Group className="my-2" controlId="confirmPassword">
                <Form.Label>Verify password:</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Retype your password here"
                    value={ confirmPassword }
                    onChange={ (e)=> setConfirmPassword(e.target.value) }
                >
                </Form.Control>
            </Form.Group>

            {isLoading && <Loader/>}

            <Button
                type="submit"
                variant="primary"
                className="mt-3"
            >
                Save
            </Button>

        </Form>
    </FormContainer>
  )
}

export default ProfileScreen