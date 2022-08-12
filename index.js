const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
const io = new Server(server, {
    cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});



let connectionCounter = 0;

app.use(cors());
app.options('*', cors()); //put this before your route

app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
    res.send("success");
})

io.on('connection', (socket) => {
    connectionCounter++;
    console.log('a user connected');
    socket.on('move', (fen) => {
        console.log(fen);
    })
    socket.on('disconnect', () => {
        connectionCounter--;
    });
    socket.on('start', () => {
        if (connectionCounter % 2 === 0) {
            socket.emit('color', "white")
            console.log("white");
        } else {            
            socket.emit('color',"black")
            console.log("black");
        }
    })
    socket.on('fen', (fen) => {
        console.log("recieved new state")
        io.emit('game_state', fen);
    })
})

const PORT = process.env.PORT || 8080;

server.listen(PORT);


/*

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to make quit.');
});
*/