import { useState, React } from 'react'
import './Home.css'
import  {toast,Toaster} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function Home() {
  const navigate = useNavigate();
  const [roomid,setroomid]=useState('');
  const [username,setusername]=useState('');

  const joinRoom = () => {
    if (!roomid || !username) {
      toast.error('ROOM ID & Username is required');
        return;
    }

    navigate(`/editor/${roomid}`, {
        state: {
            username,
        },
    });
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
    toast.success('New room created successfully!');
}

  return (
    <div className='homepage'>
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
          <button onClick={joinRoom}>Join</button>
        </div>
        <p>Don't have Room ID?<span className='link'><a href="" onClick={makeid}><b>Create Room</b></a></span></p>
      </div>
    </div>
  )
}

export default Home