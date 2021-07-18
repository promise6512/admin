import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
//import storageUtils from '../../utils/storageUtils'
export default class Admin extends Component {
    render() {
        const {user} = memoryUtils
        if(!user||!user._id){
            return (
                <Redirect to='/login'></Redirect>
            )
        }
        return (
            <div>
                hello，{user.username}
            </div>
        )
    }
}
