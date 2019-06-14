const dgram = require('dgram');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 8889;
const HOST = '192.168.10.1';

const drone = dgram.createSocket('udp4');
drone.bind(PORT);

drone.on('message', message => {
    console.log(`${message}`);
    io.sockets.emit('status', message.toString());
});

function handleError(err) {
    if (err) {
        console.log('Error');
        console.log(err);
    }
}

drone.send('command', 0, 'command'.length, PORT, HOST, handleError);

io.on('connection', socket => {
    socket.on('command', command => {
        console.log('From browser: ', command);
        drone.send(command, 0, command.length, PORT, HOST, handleError);
    });
});

http.listen(6767, () => {
    console.log('Server is listening on http://localhost:6767');
});