import React, {useState} from 'react'
import './Editor.css'
import Connected from '../../components/Connected';
import { Editor } from '@monaco-editor/react';


function Editorpage() {
  const [connectedlist,setconnectedlist] =useState([
    {userID: 1, userName: 'iStyle'},
    {userID: 2, userName: 'iPavan'},
    {userID: 3, userName: 'iBro'},
    {userID: 4, userName: 'iPawn'},
  ]);
  const editoroptions=
  {
    fontSize:18,
    wordWrap: 'on',
  }
  const [language,setlanguage]=useState('c');
  const [input,setinput]=useState('');
  const [output,setoutput]=useState('');
  const onlangchange=(e)=>
  {
    setlanguage(e.target.value);
  }
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
              <p>Code Editor</p>
            </div>
            <div className="editor-header-comps">
            <select name="language" id="code-language" onChange={onlangchange}>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="javascript">Javascript</option>
              <option value="java">Java</option>
            </select>
              <button className='runcode'>Run Code</button>
            </div>
          </div>
          <Editor className='editorcomp'
            height={'100%'}
            language={language}
            options={editoroptions}
            theme='vs-dark'
          />
        </div>
        <div className="input-output">
          <div className="input">
            <div className="header input-header">
              <p className='input-p'>Input</p>
            </div>
            <div className="input-contents">
              <textarea value={input} onChange={(e)=>setinput(e.target.value)}></textarea>
            </div>
          </div>
          <div className="output">
            <div className="header output-header">
              <p className='output-p'>Output</p>
            </div>
            <div className="output-contents">
              <textarea readOnly value={output} onChange={(e)=>setoutput(e.target.value)}></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editorpage