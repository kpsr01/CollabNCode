import React, {useState} from 'react'
import './Editor.css'
import Connected from '../../components/Connected';


function Editor() {
  const [connectedlist,setconnectedlist] =useState([
    {userID: 1, userName: 'iStyle'},
    {userID: 2, userName: 'iPavan'},
    {userID: 3, userName: 'iBro'},
    {userID: 4, userName: 'iPawn'},
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
              <button className='copy'>Room ID: ABCDEFG</button>
              <button className='leave'>Leave Room</button>
            </div>
          </div>
        </div>
      </div>
      <div className="editor">
        <div className="typecode">
          <div className="header editor-header">
            <div className="editorname">
              <p>Type Code Here</p>
            </div>
            <div className="editor-header-comps">
              <input type="text" placeholder='Choose Language' />
              <button className='runcode'>Run Code</button>
            </div>
          </div>
        </div>
        <div className="input-output">
          <div className="input">
            <div className="header input-header">
              <p className='input-p'>Input</p>
            </div>
          </div>
          <div className="output">
            <div className="header output-header">
              <p className='output-p'>Output</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor