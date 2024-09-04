import { useState, React } from 'react'
import './Home.css'
import Snackbar from '@mui/material/Snackbar';

function Home() {
  const [roomid,setroomid]=useState('');
  const [username,setusername]=useState('');
  const [state, setState] =useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };
  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => {
    setState({ ...newState, open: true });
  };

  
  const makeid=(e)=> {
    e.preventDefault();
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 7) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    setroomid(result);
    handleClick({ vertical: 'top', horizontal: 'center' })
}

  return (
    <div className='homepage'>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        message="New room created successfully!"
        autoHideDuration={3000}
        onClose={handleClose}
        key={vertical + horizontal}
      />
      <div className="homediv">
        <div className="logo-home">
          <h1>&lt;/&gt;</h1>
          <h2>Collab N Code</h2>
        </div>
        <h4>Join Room</h4>
        <div className="inputs">
          <input type="text" placeholder='USERNAME' value={username} onChange={(e)=>setusername(e.target.value)}/>
          <input type="text" placeholder='ROOM ID' value={roomid} onChange={(e)=>setroomid(e.target.value)} />
        </div>
        <div className="btn">
          <button>Join</button>
        </div>
        <p>Don't have Room ID?<span className='link'><a href="" onClick={makeid}><b>Create Room</b></a></span></p>
      </div>
    </div>
  )
}

export default Home