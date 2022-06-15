import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFolder} from '@fortawesome/free-solid-svg-icons'

function Folder({folder}) {
    return (
        // rendering <Button> as a Link
        <Button variant="outline-dark"
         className="text-truncate w-100"
         to={{
            pathname: `/folder/${folder.id}`,
            // state: {folder: folder},
         }} as={Link} >
            <div className="d-flex">
                <div className="me-2"> <FontAwesomeIcon icon={faFolder}/> </div>
                <div> {folder.name} </div>
            </div>
        </Button>
    )
}

export default Folder
