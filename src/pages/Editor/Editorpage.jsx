import React, { useState, useRef, useCallback, useEffect } from 'react';
import './Editor.css';
import { Editor } from '@monaco-editor/react';
import { BounceLoader } from 'react-spinners';
import { makesubmission } from './coderunner';
import io from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import  {toast,Toaster} from 'react-hot-toast';
import Avatar from 'react-avatar';
import { Analytics } from "@vercel/analytics/react"




function Editorpage() {
  const location = useLocation();
  const navigate=useNavigate();
  const { roomId, username } = location.state;  
  const socketRef = useRef(null);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    socketRef.current = io('https://backendforcnc.onrender.com/');
    socketRef.current.emit('joinRoom', { roomId, username });

    socketRef.current.on('codeUpdate', (newCode) => setcode(newCode));
    socketRef.current.on('languageUpdate', (newLanguage) => {
      setlanguage(newLanguage);
      changecode(newLanguage);
    });
    socketRef.current.on('inputUpdate', (newInput) => setinput(newInput));
    socketRef.current.on('outputUpdate', (newOutput) => setoutput(newOutput));

    socketRef.current.on('userJoined', ({ username, state }) => {
      console.log(`${username} joined the room`);
      setConnectedUsers((prevUsers) => [...prevUsers, username]);

      if (state) {
        setcode(state.code);
        setlanguage(state.language);
        setinput(state.input);
        setoutput(state.output);
      }
    });

    socketRef.current.on('userLeft', ({ username }) => {
      console.log(`${username} left the room`);
      setConnectedUsers((prevUsers) => prevUsers.filter(user => user !== username));
    });

    socket.on('syncState', ({ code, language, input, output }) => {
      setcode(code); 
      setlanguage(language); 
      setinput(input); 
      setoutput(output); 
    });
    

    socketRef.current.on('roomUsers', (users) => setConnectedUsers(users.map(user => user.username)));

    return () => {
      socketRef.current.emit('leaveRoom', { roomId });
      socketRef.current.disconnect();
    };
  }, [roomId, username]);


  
  const editoroptions = {
    fontSize: 18,
    wordWrap: 'on',
  };

  const [language, setlanguage] = useState('c');
  const [input, setinput] = useState('');
  const [output, setoutput] = useState('');
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
    socketRef.current.emit('codeChange', { roomId, code: value });
  };
  

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const onlangchange = (e) => {
    const lang = e.target.value;
    setlanguage(lang);
    socketRef.current.emit('languageChange', { roomId, language: lang });
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
    setoutput('');
    
  };

  const statusMessages = {
    1: "In Queue",
    2: "Processing",
    3: "Accepted",
    4: "Wrong Answer",
    5: "Time Limit Exceeded",
    6: "Compilation Error",
    7: "Runtime Error (SIGSEGV)",
    8: "Runtime Error (SIGXFSZ)",
    9: "Runtime Error (SIGFPE)",
    10: "Runtime Error (SIGABRT)",
    11: "Runtime Error (NZEC)",
    12: "Runtime Error (Other)",
    13: "Internal Error",
    14: "Exec Format Error"
  };
  
  const callback = ({ apistatus, data, message }) => {
    if (apistatus === 'loading') {
      setshowloader(true);
    } else if (apistatus === 'error') {
      setshowloader(false);
      setoutput(`Error: ${message}`);
      socketRef.current.emit('outputChange', { roomId, output: `Error: ${message}` });  
    } else if (apistatus === 'success') {
      setshowloader(false);
  
      const statusMessage = statusMessages[data.status.id] || "Unknown Status";
  
      if (data.status.id === 3) {
        const decodedOutput = data.stdout ? atob(data.stdout) : 'No output produced';
        setoutput(decodedOutput);
        socketRef.current.emit('outputChange', { roomId, output: decodedOutput });  
      } else {
        const decodedError = data.stderr ? atob(data.stderr) : statusMessage;
        setoutput(`${statusMessage}: ${decodedError}`);
        socketRef.current.emit('outputChange', { roomId, output: `${statusMessage}: ${decodedError}` }); 
      }
    }
  };
  

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setinput(newInput);
    socketRef.current.emit('inputChange', { roomId, input: newInput });  
  };
  

  const handleOutputChange = (newOutput) => {
    setoutput(newOutput);
    socketRef.current.emit('outputChange', { roomId, output: newOutput });  
  };
  
  const runcode = useCallback(() => {
    makesubmission({
      code: code,
      lang: language,
      stdin: input,
      callback,
    });
  }, [code, language, input]);

  const handleLeaveRoom = () => {
    socketRef.current.emit('leaveRoom', { roomId });
  
    socketRef.current.off('inputChange');
    socketRef.current.off('outputChange');
    socketRef.current.off('editorChange');
  
    socketRef.current.disconnect();
  
    navigate('/')
  };
  

  return (
    <div className='editorpage'>
      <Toaster
      toastOptions={{
        className: '',
        style: {
          color: '#EEEEEE',
          backgroundColor: '#222831',
          boxShadow: '0px 0px 30px #040D12',
        },
      }}
      />
      <Analytics/>
      <div className="sidebar">
        <div className="sidebarcontents">
          <div className="logo">
            <h1>&lt;/&gt;</h1>
            <h2>Collab N Code</h2>
            <hr />
          </div>
          <h4>Connected</h4>
          <div className="sidebarcomps">
          <div className="connectedlist">
              {connectedUsers.map((user, index) => (
                <div key={index} className="user">
                  <Avatar name={user} size="55" round="10px"/>
                  <span>{user}</span>
                </div>
              ))}
            </div>
            <div className="btns">
            <button className='copy' onClick={() => {
  navigator.clipboard.writeText(roomId)
    .then(() => toast.success('ROOM ID copied to clipboard!'))
    .catch(err => console.error('Failed to copy: ', err));
}}>
  Room ID: {roomId}
</button>
              <button className='leave' onClick={handleLeaveRoom}>
  Leave Room
</button>

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
              <textarea value={input} placeholder='Enter all necessary inputs seperated by a " "' onChange={handleInputChange}></textarea>
            </div>
          </div>
          <div className="output">
            <div className="header output-header">
              <p className='output-p'>Output</p>
            </div>
            <div className="output-contents">
              <textarea readOnly value={output} placeholder='Click "Run Code" to run the code' onChange={handleOutputChange}></textarea>
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
