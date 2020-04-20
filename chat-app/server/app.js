const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 4000


const app = express();
const server = http.createServer(app);
const io = socketio(server);


chatData = {
    rooms: []
}

// Helper Data



app.get('/' , (req,res)=>{
    res.send("<h1>Hello World</h1>")
})


io.on('connection' , (socket)=>{

    // Display SocketID of users
    console.log(`We got a connection ${socket.id}`)

    socket.on('create' , (data)=>{
            console.log(data)
            
            fact = true
            for(let i  = 0 ; i < chatData.rooms.length ; i++){
                if(chatData.rooms[i].name === data.room){
                    console.log(i)
                    fact = false
                    break
                }
            }

            if(fact === false){
                socket.emit('err' , 'room already exists')
                console.log("ROOM FOUND")
            }else{
                
                let obj = {
                    name: data.room,
                    users: [{
                        username: data.username,
                        id: data.id,
                    }]   
                   }
                socket.join(data.room , ()=>{
                    socket.username = data.username
                    console.log("NEW ROOM GEN: " + data.room)
                }) 
            chatData.rooms.push(obj)
            io.sockets.in(data.room).emit('success' , "success")
            }
        
        

    })

    socket.on('send' , (data)=>{
        socket.to(data.room).emit('chat' , data.message)
    })

    socket.on('join room' , (data)=>{
        
        obj ={
            fact: false,
            fact2: false,
            idNumber: null,
        }
        for(let i = 0 ; i < chatData.rooms.length ; i++){
            if(chatData.rooms[i].name === data.room){
                obj.idNumber = i
                obj.fact1 = true
                break
            }
            

        }
        if(obj.fact1){
            for(let i = 0 ; i < chatData.rooms[obj.idNumber].users.length ; i++){
                if(chatData.rooms[obj.idNumber].users[i].username === data.username){
                    
                    break
                }
                else{
                    obj.fact = true
                }
            }

            if(obj.fact){
                socket.join(data.room , ()=>{
                    console.log(`user joined the room ${data.room} with username: ${data.username}`)
                    let obj1 = {
                        username: data.username,
                        id: data.id
                    }

                    chatData.rooms[obj.idNumber].users.push(obj1)

                    

                })

                socket.emit('success' , 'success')
            }
            else{
                socket.emit('err' , "Username already exists")
            }

        }
        else{
            
            socket.emit('err' , "Room number is wrong or room doesn't exists")
        }

    })
    

    socket.on('chat leave' , (data)=>{

        socket.leave(chatData.oldroom , ()=>{
        console.log("User Has left the custom build room")
        chatData.newroom = ''
        })
        io.sockets.emit('left' , `${data.username} has left the chat`)
    })



    socket.on('chat' , (msg)=>{
        console.log(`Emit Message: ${msg}`)
        io.emit( 'chat' , msg)
    })




    socket.on('disconnect' , ()=>{
        console.log("User Disconnected")
    })
})


server.listen(PORT , ()=>{
    console.log(`Server Up and Running on http://localhost:${PORT}/`)
})