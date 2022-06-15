import React, { useContext, useState, useEffect } from 'react'
import auth from '../firebase'

const AuthContext = React.createContext()
export function useAuth(){
    // console.log(useContext(AuthContext));
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signUp(email, password){
        return auth.createUserWithEmailAndPassword(email, password)
    }
    function logIn(email,password){
        return auth.signInWithEmailAndPassword(email,password)
    }
    function logOut(){
        return auth.signOut()
    }
    function resetPassword(email){
        return auth.sendPasswordResetEmail(email)
    }
    function updateEmail(email){
        return currentUser.updateEmail(email)
    }
    function updatePassword(password){
        return currentUser.updatePassword(password)
    }

    useEffect(() => {
        // useEffect will run this function whenever <AuthProvider> component loads.
        // onAuthStateChanged() returns unsubscribe function which...
        const unsubscribe = auth.onAuthStateChanged(user =>(
            setCurrentUser(user),
            // once verification process is complete loading is set to false
            // enabling the Sign Up button
            setLoading(false)
        ))
        return unsubscribe
    }, [])

    const value = { currentUser, signUp, logIn, logOut, resetPassword, updateEmail, updatePassword }
    return (
        // If we have any function or object stored in the variable value
        //  we pass it to Authcontext provider. 
        <AuthContext.Provider value = {value} >
            {/* if loading is false then only we will render the children */}
            { !loading && children}
        </AuthContext.Provider>
    )
}
