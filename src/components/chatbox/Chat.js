
import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import "./Chat.css";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ForumIcon from '@material-ui/icons/Forum';


const Message = ({ msg }) => {
  return (
      <div className="msg">
        {/* <span className="username">Lexi</span>
        <span className="content">contentdddlksjflksfjlksdjflksjflksjfldddddddddddddd</span>
        <span className="time">timeeeeeeeeee</span> */}
        <span className="username"> { msg.userName } </span>
        <span className="content"> { msg.content } </span>
        <span className="time"> { new Date(msg.date).toUTCString() } </span> 
      </div>
  );
};


const MessageBox = (props) => {
  const [value, setValue] = useState("");

  const postMessage = e => {
      e.preventDefault();
      var val = {
        value: value,
        room_id:props.room_id,
        user_id: props.user_id
      }
      if (!val) return;
      props.socket.emit("newmessage", JSON.stringify(val));

      setValue("");
  };

  return (
    <div className="TextField-without-border-radius">
      <form className="footer" onSubmit={ postMessage }>
        <TextField 
        id="outlined-basic" 
        label="Type something" 
        variant="outlined" 
        fullWidth
        size="small"
        InputLabelProps={{style: {fontSize: 13}}}
        value={ value } 
        onChange={ e => setValue(e.target.value) }
        />
          {/* <input type="text" className="input" placeholder="message"
                 value={ value } onChange={ e => setValue(e.target.value) }
          /> */}
      </form>
      </div>
  );

};


const Chat = (props) => {
  const socket = io(`http://${process.env.REACT_APP_URL}:4000/?roomid=`+ props.room_id)
  const [messages, setMessages] = useState([]);

  const addMessage = (msg) => {
      setMessages(oldMessages => [...oldMessages, ...(Array.isArray(msg) ? msg.reverse() : [msg])]);
  };

  useEffect((props)=> {
      socket.on("latest", (data) => {
          addMessage(data);
      });
      socket.on("newmessage", (msg) => {
          addMessage(msg);
      });
      socket.connect();

  }, []);

  return (
      <div className="chatapp"> 
        <div className="chatbody">
        <div className="chat_header">
          <ForumIcon />
        <h3>Chat Room</h3>
        </div>
          <div id = "msgBox">
              { messages.map((msg, index) => <Message msg={msg} />) }
          </div>
          <div className="chatfooter">
          <MessageBox socket={socket} room_id={props.room_id} user_id={props.user_id} />
          </div>
          </div>
      </div>
  );

};


export default Chat;