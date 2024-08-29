import React, {useState} from 'react'
import './Editor.css'
import Connected from '../../components/Connected';

function Editor() {
  const [connectedlist,setconnectedlist] =useState([
    {userID: 1, userName: 'iStyle'},
    {userID: 2, userName: 'iPavan'},
    {userID: 3, userName: 'iPavn'},
    {userID: 4, userName: 'iPan'},
  ]);
  return (
    <div className='editorpage'>
      <div className="sidebar">
        <div className="sidebarcontents">
          <div className="logo">
            <h2>Collab N Code</h2>
            <hr />
          </div>
          <h4>Connected</h4>
          <div className="sidebarcomps">
            <div className="connectedlist">
              {connectedlist.map((connectedlist) => (
                <Connected userName={connectedlist.userName} userID={connectedlist.userID}/>
              ))}
            </div>
            <div className="btns">
              <h5>Room ID: ABCDEFG <span><button className='copy'><i>Copy</i></button></span></h5>
              <button className='leave'>Leave Room</button>
            </div>
          </div>
        </div>
      </div>
      <div className="editor">
        Editor
      </div>
    </div>
  )
}

export default Editor