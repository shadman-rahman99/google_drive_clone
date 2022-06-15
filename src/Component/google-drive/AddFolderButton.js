import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus} from '@fortawesome/free-solid-svg-icons'
import { database } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import {ROOT_FOLDER} from '../../hooks/useFolder'


function AddFolderButton({currentFolder}) {

    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const { currentUser } = useAuth()

    function openModal(){
        setOpen(true)
    }
    function closeModal(){
        setOpen(false)
    }

    //! handleSubmit() function will not work without even prompting error/warning
    //! message if all the objects in database.folders.add() are not set. 
    function handleSubmit(e){
        e.preventDefault();
        if(currentFolder == null) return

        const path = [...currentFolder.path]
        if(currentFolder !== ROOT_FOLDER){
            path.push({name:currentFolder.name, id:currentFolder.id})
        }

        // Storing data inside the collection named folders
        database.folders.add({
            name:name,
            parentId: currentFolder.id,
            userId: currentUser.uid,
            path: path,
            createdAt: database.getCurrentTimeStamp(),
        })
        setName("")  
        closeModal()
    }
    return (
      <> 
        <Button onClick={openModal} variant="outline-success" size="md" >
            <FontAwesomeIcon icon={faFolderPlus} />
        </Button>
        <Modal show={open} onHide={closeModal} > 
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Folder Name</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"onClick={closeModal} >Close</Button>
                    <Button variant="success"type="submit" >Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal>
      </>
      
    )
}

export default AddFolderButton
