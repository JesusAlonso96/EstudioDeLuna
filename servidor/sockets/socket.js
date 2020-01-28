const Socket = require('socket.io'),
    socketIO = require('socket.io');

export const desconectar = (cliente)=>{
    cliente.on('disconnect', ()=>{
        console.log('Cliente desconectado');
    });
}

//escuchar mensajes
export const mensaje = (cliente,io)=>{
    cliente.on('mensaje', payload =>{
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    });
}