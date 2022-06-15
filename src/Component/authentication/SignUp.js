import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert} from 'react-bootstrap'
import { Link , useNavigate} from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import CenteredContainer from './CenteredContainer'

function SignUp() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {signUp} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault();
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('Passwords do not match')
        }try{
            // If passwword and confirm password match error is set to empty string
            // and loading is true so that submit button cant be clicked multiple times
            // and create several users at the same time.
            setError('')
            setLoading(true)
            // Firebase requires at least 6-digit password to sign up a user
            await signUp(emailRef.current.value, passwordRef.current.value)
            navigate('/')
        }catch{
            setError("Falied to create an account")
        }
        setLoading(false)
    }

    return (
        <CenteredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4" >Sign Up</h2>
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
                        <Form.Group id="password-confirmation" >
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required/>
                        </Form.Group>
                        {/* If loading is true Button is disabled */}
                        <Button disabled={loading} className="w-100 mt-3" type="submit" >Sign Up</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login" >Log In</Link>
            </div>
        </CenteredContainer>
    )
}

export default SignUp
