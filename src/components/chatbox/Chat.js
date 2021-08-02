import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import "./Chat.css";

const Message = ({ msg }) => {
  return (
      <div className="msg">
          <span> { new Date(msg.date).toUTCString() } </span>
          <span> { msg.userName } </span>
          <span> { msg.content } </span>
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
      <form className="footer" onSubmit={ postMessage }>
          <input type="text" className="input" placeholder="message"
                 value={ value } onChange={ e => setValue(e.target.value) }
          />
      </form>
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
      <div>
          <div id = "msgBox">
              { messages.map((msg, index) => <Message msg={msg} />) }
          </div>
          <MessageBox socket={socket} room_id={props.room_id} user_id={props.user_id} />
      </div>
  );

};


export default Chat;
