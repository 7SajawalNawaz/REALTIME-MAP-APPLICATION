const express = require('express');
const http = require("http");
const path = require("path");
const app=express();
const socketio = require("socket.io");

const server = http.createServer(app);

const io = socketio(server)

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


io.on("connection", function(socket){
    socket.on("sendLocation", function(location){
        io.emit("receiveLocation", {id : socket.id, ...location});
    })
    
    socket.on("disconnect", function(){
io.emit("userDisconnected", socket.id);
    })
    
})



app.get("/" , function (req,res){
    res.render("app")
})



const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});