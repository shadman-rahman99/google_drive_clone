import React from 'react'
import {Breadcrumb} from 'react-bootstrap'
import {ROOT_FOLDER} from '../../hooks/useFolder'
import {Link} from 'react-router-dom'

function FolderBreadcrumbs({currentFolder}) {

    // if currentFolder is similar to ROOT_FOLDER then we are currently inside
    // currentFolder, so path is equal to an empty array or else we store ROOT_FOLDER
    // into path.
    let path = (currentFolder === ROOT_FOLDER) ? [] : [ROOT_FOLDER]

    // if currentFolder is true (currentFolder.id != null...probably) then 
    // we update path with currentfolder.path.
    if(currentFolder){
        // Initially path is an array object.
        // spread operator is used to convert path from an array to just a
        // mapped object so that it can later be stored inside path itself.
        // Otherwise path would be a muilti-dimensional array. Console log
        // the following for more info...
        //  console.log("Path>>>",path,"\nPath spread operated>>>",...path);
        path = [...path, ...currentFolder.path]
    }
    return (
        <Breadcrumb className="flex-grow-1 m-0" 
        listProps={{className:"m-0 bg-white p-0"}} >
            {
                path.map((folder,index) =>(
                <Breadcrumb.Item className="text-truncate d-inline-block"
                    style={{maxWidth:"200px"}} key={folder.id} 
                    linkAs={Link} linkProps={{
                        to: {
                        pathname: (folder.id) ? `/folder/${folder.id}` : "/",
                        // console log the next comment to know what path.slice(1,index) means 
                        // state: { folder : {...folder, path: path.slice(1,index)}},
                        },
                    }} >
                    {console.log("path slice : ",path.slice(1,index))}
                    {folder.name}
                </Breadcrumb.Item>
                ))
            }
            {currentFolder && (
                <Breadcrumb.Item className="text-truncate d-inline-block"
                    style={{maxWidth:"200px"}} active>
                    {currentFolder.name}
                </Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}

export default FolderBreadcrumbs