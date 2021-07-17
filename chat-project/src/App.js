import './App.css';
import React from "react";
import Chat from './Chat';
import Pusher from "pusher-js";
// import { useEffect, useState } from "react";
import axios from "./axios";


function App() {
  const [comments, setComments] = React.useState([]);

  React.useEffect(() => {
    //for the fetch
    axios.get('/comments/sync').then(response=>{
        setComments(response.data);
    });

  },[]);

  React.useEffect(() => {
    const pusher = new Pusher('5391b962e408f216b9b0', {
      cluster: 'us3'
    });

      //set up a listener to pusher
      //everytimes changes, run the code below
    const channel = pusher.subscribe('chats');
    channel.bind('inserted', (newComment)=> {
      setComments([...comments, newComment])
    });

    //clean up function
    //make sure even if the subscribe changes, we only have one subscriber
    return() => {
      channel.unbind_all();
      channel.unsubscribe();
    };

  },[comments]);

  console.log(comments);

  return (
    <div className="app">
      <div className="app_body">
        <Chat comments={comments}/> 
      </div>
      
    </div>



  );
}

export default App;
