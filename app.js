const express = require('express');
const mongoose = require("mongoose");
const events = require("events");
const moment = require("moment");
const http = require("http");
const User = require("./model/User");
const Log = require("./model/Log");
 
const app = express()

//MONGOOSE
const connectionString = "mongodb+srv://TajSivers:rayquaza48@cluster0-uyjtg.azure.mongodb.net/ChatApp?retryWrites=true&w=majority";

mongoose
    .connect(connectionString, { useNewUrlParser: true} )

    .then( () => { console.log("Mongoose connected successfully \n"); },

    error => {console.log("Mongoose could not connect to the database: " + error); } );

const eventEmitter = new events.EventEmitter();


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

//routes
app.get('/', (req,res) => {
    res.render('index')
})

//listen on port 300
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io")(server)

//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected')

    //default username
    socket.username = "Anonymous"

    async function LogSave(data) {
        const log = new Log({
            LogType: data.LogType,
            Name: data.Name,
            Message: data.message,
            Time: data.Time
        })
        const result = await log.save();
        console.log("********** THE LOG TABLE **********");
        console.log(result);
    }
    

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
        let time = moment().format('MMMM Do YYYY, h:mm:ss a');
        LogSave({ //Updates log for change in username
            LogType: 'change_username',
            Name: data.username,
            Message: 'Username has been changed.',
            Time: time
        });
        console.log(socket.username);
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcasts new message
        let username = socket.username;
        let message = data.message;
        let room = 'Chat Room';
        let time = moment().format('MMMM Do YYYY, h:mm:ss a');
        //check for name and message
        if (message == ''){
            console.log('Error' + username + ' Message cannot be empty.');
        }
        else{
            async function saveUser(){
                let ChatUser = new User({
                    Sender: socket.username,
                    Message: message,
                    Room: room,
                    Time: time
                })
                console.log(ChatUser);
                const result = await ChatUser.save();
                console.log("********** CHAT HISTORY TABLE **********")
                console.log(result)
                io.sockets.emit('new_message',{
                    sender: socket.username,
                    message: message,
                    room: room,
                    time: time
                })
            }
            LogSave({
                LogType: 'new_message',
                Name: socket.username,
                Message: 'Message has been sent.',
                Time: time
            });
            saveUser();
        }        
    })

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username})
    })

    //disconnect 
    socket.on("disconnect", function() {
        console.log("Disconnected...");
        let time = moment().format('MMMM Do YYYY, h:mm:ss a');
        LogSave({ //log disconnect from server
            LogType: 'disconnect',
            Name: socket.username,
            Message: 'Username has disconnected.',
            Time: time
        });
    })

    socket.on("chat_history", function(){
        console.log("************** COMPLETE CHAT HISTORY **************");
        User.find(function(err,result){
            if ( err){
                console.log("Error !")
            }
            else{
                console.log(result);
                socket.emit("chat_history");
            }
        });
    })
});