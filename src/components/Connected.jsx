import React from 'react'
import Avatar from 'react-avatar'
import './Connected.css'

function Connected({userName}) {
  return (
    <div className="connectedwrap">
      <div className='connected'>
        <Avatar name={userName} size='50' round='14px'/>
        <h5>{userName}</h5>
      </div>
    </div>
  )
}

export default Connected