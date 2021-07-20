import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import "./Chat.css";
const socket = io('http://localhost:4000')
const userName = 'User ' + parseInt(Math.random() * 3)
function App() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])

  useEffect(() => {
    socket.on('message', msg => {
      setChat([...chat, msg])
    })
  })

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(message)
    socket.emit('message', { userName, message })
    setMessage('')
  };

  return (
    <div className="app">
      <div className="app_body">
        <div className="chat">
          <div className="chat_header">
            <div className="chat_headerInfo">
              <h2>Room 1</h2>
            </div>
            <div className="chat_headerRight">
            </div>
          </div>

          <div className="chat_body">
            <div className={"sender"}>
              {chat.map((payload, index) => {
              return (
                <p className="text" key={index}>{payload.userName}:
                 <span>{payload.message}</span>
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
              <input type="text" name="message"
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
