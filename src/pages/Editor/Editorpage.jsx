import React, { useState, useRef, useCallback, useEffect } from 'react';
import './Editor.css';
import Connected from '../../components/Connected';
import { Editor } from '@monaco-editor/react';
import { BounceLoader } from 'react-spinners';
import { makesubmission } from './coderunner';

function Editorpage() {
  const [connectedlist, setconnectedlist] = useState([
    { userID: 1, userName: 'iStyle' },
    { userID: 2, userName: 'iPavan' },
    { userID: 3, userName: 'iBro' },
    { userID: 4, userName: 'iPawn' },
  ]);

  const editoroptions = {
    fontSize: 18,
    wordWrap: 'on',
  };

  const [language, setlanguage] = useState('c');
  const [input, setinput] = useState('');
  const [output, setoutput] = useState('Click "Run Code" to run the code');
  const [code, setcode] = useState(`// Default C code
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`);
  const [showloader, setshowloader] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    changecode(language);
  }, [language]);

  const handleEditorChange = (value) => {
    setcode(value);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const onlangchange = (e) => {
    const lang = e.target.value;
    setlanguage(lang);
  };

  const changecode = (lang) => {
    if (lang === 'c') {
      setcode(`// Default C code
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`);
    } else if (lang === 'cpp') {
      setcode(`// Default C++ code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`);
    } else if (lang === 'java') {
      setcode(`// Default Java code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`);
    } else if (lang === 'python') {
      setcode(`# Default Python code
print("Hello, World!")`);
    } else if (lang === 'javascript') {
      setcode(`// Default JavaScript code
console.log("Hello, World!");`);
    }
    setinput('');
    setoutput('Click "Run Code" to run the code')
  };

  const callback = ({ apistatus, data, message }) => {
    if (apistatus === 'loading') {
      setshowloader(true);
    } else if (apistatus === 'error') {
      setshowloader(false);
      setoutput('Something went wrong, try again!');
    } else {
      setshowloader(false);
      if (data.status.id === 3) {
        setoutput(atob(data.stdout));
      } else {
        setoutput(atob(data.stderr));
      }
    }
  };

  const runcode = useCallback(() => {
    makesubmission({
      code: code,
      lang: language,
      stdin: input,
      callback,
    });
  }, [code, language, input]);

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
              {connectedlist.map((user) => (
                <Connected key={user.userID} userName={user.userName} userID={user.userID} />
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
              <select name="language" id="code-language" onChange={onlangchange} value={language}>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
              </select>
              <button className='runcode' onClick={runcode}>Run Code</button>
            </div>
          </div>
          <Editor
            className='editorcomp'
            height='100%'
            language={language}
            options={editoroptions}
            value={code}
            theme='vs-dark'
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
          />
        </div>
        <div className="input-output">
          <div className="input">
            <div className="header input-header">
              <p className='input-p'>Input</p>
            </div>
            <div className="input-contents">
              <textarea value={input} onChange={(e) => setinput(e.target.value)}></textarea>
            </div>
          </div>
          <div className="output">
            <div className="header output-header">
              <p className='output-p'>Output</p>
            </div>
            <div className="output-contents">
              <textarea readOnly value={output} onChange={(e) => setoutput(e.target.value)}></textarea>
            </div>
          </div>
        </div>
      </div>
      {showloader && <div className="loader-container">
        <div className="loader">
          <BounceLoader
            color="#00ADB5"
            size={100}
          />
        </div>
      </div>}
    </div>
  );
}

export default Editorpage;
