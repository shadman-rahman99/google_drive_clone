import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert} from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import {Link, useNavigate} from 'react-router-dom'
import CenteredContainer from './CenteredContainer'

function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const {logIn} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault();
        try{
            setError('')
            setLoading(true)
            await logIn(emailRef.current.value, passwordRef.current.value)
            navigate('/')
        }catch{
            setError("Falied to log in")
        }
        setLoading(false)
    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4" >Log In</h2>
                    {/* If error is true it will render Alert tags with error message */}
                    {error && <Alert variant="danger" > {error} </Alert> }
                    <Form onSubmit={handleSubmit} >
                        <Form.Group id="email" >
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required/>
                        </Form.Group>
                        <Form.Group id="password" >
                            <Form.Label>password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>
                        {/* If loading is true Button is disabled */}
                        <Button disabled={loading} className="w-100 mt-3" type="submit" >
                            Log In</Button>
                        <div className="w-100 text-center mt-3">
                            <Link to="/forgot-password" >Forgot Password?</Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup" >Sign Up</Link>
            </div>
        </CenteredContainer>
    )
}

export default Login
