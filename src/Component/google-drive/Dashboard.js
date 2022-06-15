import React from 'react'
import { Container } from 'react-bootstrap'
import AddFolderButton from './AddFolderButton'
import AddFileButton from './AddFileButton'
import NavbarComponent from './Navbar'
import { useFolder } from '../../hooks/useFolder'
import Folder from './Folder'
import File from './File'
import {useParams, useLocation} from 'react-router-dom'
import FolderBreadcrumbs from "./FolderBreadcrumbs"

function Dashboard() {

    // receiveing folderId from the URL using useParams and 
    // passing folderId to useFolder() function as an argument.
    const {folderId} = useParams()

    // ! state from useLocation is currently not in use
    // state is initially set to an empty object. We are using state from
    // useLocation fucntion so that we dont get any flash when loading data 
    // on Breadcrumbs in FolderBreadcrumbs component. 
    const { state = {} } = useLocation()
    
    // Initially folderId is null whenever we open Dashboard since we are not
    // rendering dashboard through URL consisting of parameters. So dashboard 
    // renders all the files and folders where parentId is null 
    // (belonging to root folder). 
    const {folder, childFolders, childFiles} = useFolder(folderId)
    // console.log(state.folder);
    // const state = useFolder()
    console.log("Folder >>> ",folder);
    console.log("Child Folder >>> ",childFolders);
    return (
       <>
      <NavbarComponent></NavbarComponent>
      <Container fluid >
          <div className="d-flex align-items-center">
            <FolderBreadcrumbs currentFolder={folder}/>
            <AddFileButton currentFolder={folder} />
            <AddFolderButton currentFolder={folder} />
          </div>
          {/* Only rendering folder component if childFolders.length>0 is true */}
          { childFolders?.length>0 && (
              <div className="d-flex flex-wrap" >
                  {
                      childFolders.map(childFolder => (
                        <div className="p-2" key={childFolder.id} 
                        style={{maxWidth: "200px"}}>
                            <Folder folder={childFolder} />
                        </div> 
                      ))
                  }
              </div>
          )}
        {childFolders?.length > 0 && childFiles?.length > 0 && <hr />}
        {childFiles?.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles?.map(childFile => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
      </Container>
      </>
    )
}

export default Dashboard
