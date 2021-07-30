import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import "./Chat.css";
import Avatar from '@material-ui/core/Avatar';

const socket = io(`http://${process.env.REACT_APP_URL}:4000`)
const userName = 'User ' + parseInt(Math.random() * 3)
function App() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])


  useEffect(() => {
    socket.on('newmessage', msg => {
      setChat([...chat, msg])
    })
  })

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(message)
    socket.emit('newmessage', { userName, message })
    setMessage('')
  };

  return (
    <div className="app">
      <div className="app_body">
        <div className="chat">
          <div className="chat_header">
              <Avatar src="https://images.unsplash.com/photo-1585218356057-dc0e8d3558bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1267&q=80"/>
            <div className="chat_headerInfo">
              <h3>Chat Room</h3>
            </div>
            <div className="chat_headerRight">
            </div>
          </div>

          <div className="chat_body">
            <div className={"sender"}>
              {chat.map((data, index) => {
              return (
                <p className="text" key={index}>{data.userName}:
                 <span>{data.message}</span>
                 <span className="sender_chat_timestamp">
                {new Date().toUTCString()}
                </span>
                </p>
                )
              })}
            </div>
          </div>


          <div className="chat_footer">
            <form onSubmit={sendMessage}>
              <input type="text" name="newmessage"
                placeholder='Type message'
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
                required
              ></input>
              <button className="button button1" type='submit'>Send</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
