import React from 'react'
import { Navbar, Nav} from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Naming the function NavbarComponent because we're importing
// Navbar from react-bootstrap so there might be naming conflict
function NavbarComponent() {
    return (
        <Navbar className="p-2" bg="light" expand="xxl" >
            <Navbar.Brand as={Link} to="/" >
                Google Drive Clone
            </Navbar.Brand>
            <Nav>
                <Nav.Link as={Link} to="/user" >
                    Profile
                </Nav.Link>
            </Nav>
        </Navbar>
    )
}

export default NavbarComponent
