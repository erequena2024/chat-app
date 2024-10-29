const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
   console.log("Nuevo usuario conectado");

   // Enviar un mensaje de bienvenida solo al usuario nuevo
   socket.emit("mensaje", "Bienvenido al chat!");

   // Notificar a otros usuarios que alguien se ha unido
   socket.broadcast.emit("mensaje", "Un nuevo usuario se ha unido al chat.");

   // Escuchar eventos de mensaje
   socket.on("mensaje", (mensaje) => {
      io.emit("mensaje", mensaje); // Enviar a todos los usuarios
   });

   // Manejar cuando un usuario está escribiendo
   socket.on("escribiendo", (nombre) => {
      socket.broadcast.emit("escribiendo", nombre);
   });

   // Notificar a todos cuando alguien se desconecta
   socket.on("disconnect", () => {
      console.log("Usuario desconectado");
      io.emit("mensaje", "Un usuario ha dejado el chat.");
   });
});

server.listen(PORT, () => {
   console.log(`Servidor en puerto ${PORT}`);
});