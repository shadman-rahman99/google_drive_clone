import React from 'react'
import SignUp from "./authentication/SignUp";
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Profile from './authentication/Profile'
import Login from './authentication/Login'
import PrivateRoute from './authentication/PrivateRoute'
import ForgotPassword from './authentication/ForgotPassword'
import UpdateProfile from './authentication/UpdateProfile'
import Dashboard from './google-drive/Dashboard'


function App() {
  return (
    // Calling <AuthProvider> will run AuthProvider() in AuthContext.js 
        <Router>
          <AuthProvider>
            <Routes>

              {/* Drive Routes*/}
              {/* The route below is a private route. If the <PrivateRoute>
              component allows accesibility (user logged in) then only it will render dashboard */}
              <Route exact path='/' element={<PrivateRoute/>}>
                <Route exact path='/' element={<Dashboard/>}/>
                {/* :folderId is actually a parameter that is passed through URL.
                Whenever this route is called Dashboard component is rendered and
                using useParams function we retrieve all the params passed into the
                Dashboard using that URL */}
                <Route exact path='/folder/:folderId' element={<Dashboard/>}/>
              </Route>

              {/* Profile Routes */}
              <Route exact path='/' element={<PrivateRoute/>}>
                <Route path='/user' element={<Profile/>}/>
                <Route path="/update-profile" element={<UpdateProfile/>} />
              </Route>

              {/* Authentication Routes */}
              <Route path="/signup" element={<SignUp/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
            </Routes>
          </AuthProvider>
        </Router>
  );
}

export default App;
