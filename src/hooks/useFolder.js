import React, { useReducer, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { database } from '../firebase'

const ACTIONS = {
    SELECT_FOLDER: "select-folder",
    UPDATE_FOLDER: "update-folder",
    SET_CHILD_FOLDERS : "set-child-folders",
    SET_CHILD_FILES: "set-child-files",
}

export const ROOT_FOLDER = {
    name: "Root",
    id:null,
    path:[]
}

function reducer(state, {type, payload}){
    switch(type){
        case ACTIONS.SELECT_FOLDER:
            return {
                folderId:payload.folderId,
                folder: payload.folder,
                childFolders: [],
                chidfiles: []
            }
            case ACTIONS.UPDATE_FOLDER:
                return {
                    // spreads all the objects in our state keeping everything
                    // as it is.
                    ...state,
                    // Only updating folder object
                    folder: payload.folder,
                }
                case ACTIONS.SET_CHILD_FOLDERS:
                    return {
                        ...state,
                        childFolders: payload.childFolders,
                    }
                case ACTIONS.SET_CHILD_FILES:
                    return {
                        ...state,
                        childFiles: payload.childFiles,
                    }
            // if we do not have an action we return the default state
            default:
                return state
    }
}
// Whenever a variable has to be null, its necessary to initilize it as null
// otherwise firebase dont handle variables without any intialization.
// Initially useFolder will render all the folder and files where their parentId
// is null.
export function useFolder(folderId=null, folder=null){

    const [state, dispatch] = useReducer(reducer,
    // All the state objects below are initialState/default state
        {
        folderId,
        folder,
        childFolders: [],
        childFiles: [],
    })
    const {currentUser} = useAuth()

    useEffect(() => {
        dispatch({ type:ACTIONS.SELECT_FOLDER, payload: {folderId,folder} })
        // Every time folderId or folder changes
        // (by clicking/accessing a folder or Root folder)  we will run the useEffect
        // which will call the dispatch function, eventually calling the reducer function.
        // The reducer function runs based on the ACTION type. Once reducer run
        // it will reset all the state objects to its default and then loads
        // new data based on the reducer fucntion.
    }, [folderId,folder])


    // On changing folderId this useEffect shall also be triggered right after
    // the useEffect above. Firstly state objects are set based on previous useEffect
    // and then later the folder object is updated based on this useEffect.
    useEffect(() => {
        if(folderId == null){
            return dispatch({
                type:ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })}
// Fetching single document from database for the current folder we are on
//  using folderId
        database.folders.doc(folderId).get().then(doc => {
            // if doc is true then we dispatch and update the folder object. 
            dispatch({
                type:ACTIONS.UPDATE_FOLDER,
                payload: { folder: database.formatDoc(doc) }
            })
            // console.log(database.formatDoc(doc))
        })
        // If we cannot get any data from the database (due to errors or firestore rule)
        // then we redirect user to root folder. Console log the event for more info..
        .catch((e) => {
            // console.log(e);
            dispatch({
                type:ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        })
    }, [folderId])

    useEffect(() => {
        return database.folders.where("parentId", "==", folderId)
        .where("userId", "==",currentUser.uid)
        .orderBy("createdAt")
        .onSnapshot(snapshot => (
            dispatch({
                type:ACTIONS.SET_CHILD_FOLDERS,
                payload: { childFolders: snapshot.docs.map(database.formatDoc) }
            })
        ))
    }, [folderId, currentUser])

    useEffect(() => {
        return (
          database.files
            .where("folderId", "==", folderId)
            .where("userId", "==", currentUser.uid)
            .orderBy("createdAt")
            .onSnapshot(snapshot => {
              dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: { childFiles: snapshot.docs.map(database.formatDoc) },
              })
            })
        )
      }, [folderId, currentUser])
    
    return state
}