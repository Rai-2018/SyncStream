import express from 'express';
import mongoose from 'mongoose';
import Comments from './dbchat.js';
import Pusher from "pusher";
import cors from "cors";
//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1234099",
    key: "5391b962e408f216b9b0",
    secret: "a8ea476c010edc52fb6d",
    cluster: "us3",
    useTLS: true
  });

//middleware
app.use(express.json());
app.use(cors());

// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next();
// });

//db config
const connect_url = 'mongodb+srv://Lexi:kxwLCq7MMB3GG97@cluster0.j7ghp.mongodb.net/Chat-mongodb?retryWrites=true&w=majority'
//connect mongodb
mongoose.connect(connect_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true

})
// trigger the Pusher
const db = mongoose.connection
db.once('open', ()=>{
    console.log("db is connected")

    const chatCollection = db.collection("commentcontents");
    const changeStream = chatCollection.watch();

    changeStream.on('change', (change)=>{
        console.log(change);

        // put all data in fullDocuments in comment
        if(change.operationType === 'insert'){
            const commentDetails = change.fullDocument;
            pusher.trigger('chats', 'inserted', {
                user_name: commentDetails.user_name,
                comment: commentDetails.comment,
                timestamp: commentDetails.timestamp,
                received: commentDetails.received,
            });
        }else{
            console.log('Error triggering Pusher');
        }

    });
});


//api routes
app.get('/',(req,res)=>res.status(200).send('hello!'));


app.get('/comments/sync', (req, res) => {
    Comments.find((err ,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.post('/comments/new', (req, res) => {
    const dbComment = req.body

    Comments.create(dbComment, (err ,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

//listen
app.listen(port,()=>console.log(`Listening on localhost:${port}`));