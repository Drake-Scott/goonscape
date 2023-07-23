var socket = io();

var canvas = document.getElementById('c');
canvas.width = 960;
canvas.height = 540;

var c = canvas.getContext('2d');
refreshCanvas();


socket.on('render', (data) => {
    refreshCanvas();
    data.forEach(player => {    
        c.fillStyle = player.color;
        c.fillRect(player.x, player.y, 25, 50)
    });
})

function refreshCanvas() {
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
}

// Get user input
document.addEventListener('keydown', (event) => {
    if(event.key == 'd') {
        socket.emit('keypress', {id: 'right', state: true}); 
    }
    else if(event.key == 's') {
        socket.emit('keypress', {id: 'down', state: true});
    }
    else if(event.key == 'a') {
        socket.emit('keypress', {id: 'left', state: true});
    }
    else if(event.key == 'w') {
        socket.emit('keypress', {id: 'up', state: true});
    }
});
document.addEventListener('keyup', (event) => {
    if(event.key == 'd') {
        socket.emit('keypress', {id: 'right', state: false}); 
    }
    else if(event.key == 's') {
        socket.emit('keypress', {id: 'down', state: false});
    }
    else if(event.key == 'a') {
        socket.emit('keypress', {id: 'left', state: false});
    }
    else if(event.key == 'w') {
        socket.emit('keypress', {id: 'up', state: false});
    }
});