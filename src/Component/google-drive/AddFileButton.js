import React, { useState } from 'react'
import {faFileUpload} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { useAuth } from '../../contexts/AuthContext'
import { database, storage } from '../../firebase'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import ReactDOM from "react-dom"
import { v4 as uuidV4 } from "uuid"
import { ProgressBar, Toast } from "react-bootstrap"

//!  ****************** Bugs  ******************
//     1.Cannot upload the same file consecutively twice without reloading dasboard.
//     2. Progress Bar do not work
//! ******************************************** 

function AddFileButton({currentFolder}) {

    // uploadingFiles is used in the progress bar
    const [uploadingFiles, setUploadingFiles] = useState([])
    const {currentUser} = useAuth() 

    function handleUpload(e){
        // we're accepting only single files incase user uploads an array of file
        const file = e.target.files[0] 
        // returning nothing if following conditions are true
        if(currentFolder == null || file == null) return
        // uuidV4 generates unique identifier
        const id = uuidV4()
        setUploadingFiles(prevUploadingFiles => [
          ...prevUploadingFiles,
          { id: id, name: file.name, progress: 0, error: false },
        ])
        const filePath =
        currentFolder === ROOT_FOLDER
          ? `${currentFolder.path.join("/")}/${file.name}`
          : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`
        console.log("Current folder path: ",currentFolder.path);
        console.log("Current folder path Join: ",currentFolder.path.join("/"));
        // storage.ref determines the location to where exactly we're stroring
        // our files in Firebase Storage. put(file) basically stores the data
        // inside file variable into Firebase Storage based on the ref value. 
        const uploadTask = storage.ref(`/files/${currentUser.uid}/${filePath}`)
        .put(file)

        uploadTask.on("state_changed", 
            // snapshot tells us constant progress of the file when uploading
            snapshot => {
                const progress = snapshot.bytesTransferred/snapshot.totalBytes
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.map(uploadFile => {
                        // if uploadFile.id is equal to the id from uuidV4()
                        // then the following happens 
                        if(uploadFile.id === id){
                            return { ...uploadFile,progress: progress}
                        }
                        return uploadFile
                    })
                })  
            },
            // Next Function handle errors
            () => {
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.map(uploadFile => {
                      if (uploadFile.id === id) {
                        return { ...uploadFile, error: true }
                      }
                      return uploadFile
                    })
                  })
            },
            // When uploading is 100% complete this function triggers
            () => (
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.filter(uploadFile => {
                      return uploadFile.id !== id
                    })
                  }),
                uploadTask.snapshot.ref.getDownloadURL().then(url => (
                  // Checking if a file already exist with the same name in the same folder
                  // under the same user.
                    database.files.where("name","==", file.name)
                    .where("userId","==",currentUser.uid)
                    .where("folderId","==",currentFolder.id)
                    .get()
                    // If we get any file with similar name then we update 
                    // existing file's url with the url from snapshot.ref.getDownloadURL() .  
                    .then(existingFiles => {
                      const existingFile = existingFiles?.docs[0]
                      if(existingFile){
                        existingFile.ref.update({url:url})
                      }else{
                        database.files.add({
                          url: url,
                          name: file.name,
                          createdAt: database.getCurrentTimeStamp(),
                          folderId:currentFolder.id,
                          userId:currentUser.uid,
                      })
                      }
                    })
                ))
            )
        )
    }

    return (
        <>
        <label className="btn btn-outline-success btn-md me-2" >
            <FontAwesomeIcon icon={faFileUpload} />
            <input
                type="file"
                onChange={handleUpload}
                style={{opacity:0, position:"absolute", left:"-9999px"}}
            />
        </label>
        {/* Displaying file uploading progress */}
        {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {console.log("Upload progress: ",uploadingFiles.length)}
            {console.log("Upload progress: ",uploadingFiles)}
            {uploadingFiles.map(file => (
              <Toast
                key={file.id}
                onClose={() => {
                  setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.filter(uploadFile => {
                      return uploadFile.id !== file.id
                    })
                  })
                }}
              >
                <Toast.Header
                  closeButton={file.error}
                  className="text-truncate w-100 d-block"
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
        </>
    )
}

export default AddFileButton
