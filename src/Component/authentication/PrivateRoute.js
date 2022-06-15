import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

// If there's any component passing in then we rename it to Component
// with uppercase 'C'. Any other property passing in is just stored in rest
// which is spread operated.
export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth()

  return (
     //   If currentUser is true (user logged in) then the requested component
    // will render otherwise redirected to login page. 
    currentUser ? <Outlet /> : <Navigate to="/login" />
  )
}