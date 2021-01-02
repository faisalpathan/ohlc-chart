import io from 'socket.io-client';

import { BASE_API_PATH_SOCKET } from '../constants'

const socket = io(BASE_API_PATH_SOCKET, { secure: false });

let dataPointsCallback = () => { }

socket.on('connect', () => {
    console.log(socket.connected);
});

socket.subscribe = (callback) => {
    dataPointsCallback = callback
    socket.emit('sub', { state: true });
}

socket.on('data', (data, callback) => {
    dataPointsCallback(data)
    callback(1);
});

socket.unsubscribe = () => {
    socket.emit('unsub', { state: false });
}

socket.on('error', (data) => {
    console.error(`Response: ${data}`)
});

export default socket;
