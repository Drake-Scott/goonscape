const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const DIAGONAL = Math.sqrt(2) / 2;

/* Set up static file serving with Express */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));


class Bullet {
    // Grab the id of the player who shot the bullet to avoid self harm.
    constructor(x, y, color, velocity, destination, id) {

    }
}

class Player {
    constructor(x, y, id, color, velocity) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.color = color;
        this.max_v = velocity;
        this.v_x = 0;
        this.v_y = 0; 
        this.controller = {up: false, down: false, left: false, right: false};
    }

    update = () => {
        this.updatePosition();
    }

    updatePosition = () => {
        if(this.controller.up) {
            this.v_y -= 1
        }
        if(this.controller.down) {
            this.v_y += 1
        }
        if(this.controller.left) {
            this.v_x -= 1
        }
        if(this.controller.right) {
            this.v_x += 1
        }

        if( Math.abs(this.v_y) + Math.abs(this.v_y) >= 2) {
            this.y += this.v_y * DIAGONAL * this.max_v;
            this.x += this.v_x * DIAGONAL * this.max_v;
        }
        else {
            this.y += this.v_y * this.max_v;
            this.x += this.v_x * this.max_v;
        }

        this.v_x = 0;
        this.v_y = 0;
    }
}

function randomColor() {
    var colors = ['purple','green','blue','orange','yellow','white'];
    return colors[ Math.floor(Math.random()*6) ]
}


/* Establish socket.io connection to client */
var SOCKETS = new Map();
io.on('connection', (socket) => {
    console.log('client connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        SOCKETS.delete(socket.id)
    });

    // initialize a player 
    let player = new Player(0, 0, socket.id, randomColor(), 10)
    socket.player = player;
    SOCKETS.set(socket.id, socket);

    socket.on('keypress', (data) => {        
        socket.player.controller[data.id] = data.state;
    });
})

server.listen(process.env.PORT || 3001, () => {
    console.log('Serving running');
});

setInterval(() => {

    var positions = [];
    // Update game state.
    for(let socket of SOCKETS.values()){   
        socket.player.update();
        positions.push(socket.player)
    }
    // Render on client side.
    for(let socket of SOCKETS.values()){
        socket.emit('render', positions);
    }


}, 1000/60)