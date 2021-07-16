import React from 'react';
import './Chat.css';
import { Avatar } from "@material-ui/core";
// import InsertEmotionIcon from "@material-ui/icons/InsertEmoticon";
import axios from "./axios";
import { func } from 'prop-types';

function Chat({ comments }) {

    var checkReceiver = function (comment) {
        if (comment.received) {
            return (
                <div className={"sender"}>
                    <p className="sender_message">
                        <span className="sender_name">
                            {comment.user_name}
                        </span>
                        {comment.comment}
                    </p>
                    <span className="sender_chat_timestamp">
                        {comment.timestamp}
                    </span>

                </div>
            );

        } else {
            return (
                <div className="reciever">
                    {/* timestamp */}
                    <span className="reciever_chat_timestamp">
                        {comment.timestamp}
                    </span>
                    <p className="reciever_message">
                        <span className="reciever_name">
                            {comment.user_name}
                        </span>
                        {comment.comment}
                    </p>
                </div>
            );

        }
    };


    const sendMessage = async (e) => {
        e.preventDefault();

        await axios.post('/comments/new', {
            comment: input,
            user_name: "User 1",
            timestamp: "July 11 2021",
            received: true,
        });

        setInput("");
    };

    const [input, setInput] = React.useState("");

    return (
        <div className="chat">
            <div className="chat_header">
                <Avatar src="https://images.unsplash.com/photo-1585218356057-dc0e8d3558bb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80" />

                <div className="chat_headerInfo">
                    <h2>Room 1</h2>
                </div>

                <div className="chat_headerRight">

                </div>

            </div>

            <div className="chat_body">
                {comments.map(comment =>
                    checkReceiver(comment)
                )}
            </div>


            <div className="chat_footer">
                {/* <InsertEmotionIcon /> */}

                <form>
                    <input
                        // value={input}
                        // onChange={(e) => setInput(e.target.value)}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type the comment"
                        type="text"
                    />
                    <button onClick={sendMessage} class="button button1 " type="submit">

                        Send
                    </button>
                </form>

            </div>


        </div>
    )
}

export default Chat
