//https://github.com/mac8905
//Author: Miguel Caro
//NodeJS Server

//Inicializacion del framework Express
var express = require("express");
var app  = express();

//Inclucion de libreria socket
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Modulo nativo NodeJS para resolver rutas
var path = require("path");

//Obtiene el numero de puerto de c9
var port = process.env.PORT;

var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//Configuracion y conexion a MongoDB
var mongoose = require('mongoose');
var configDB = require('./server/config/database.js');
mongoose.connect(configDB.url);

app.use(bodyParser.json());
app.use(methodOverride());

//Se establece el motor de vistas EJS
app.set('view engine', 'ejs');

//Se establece el directorio de almacenamiento de las vistas
app.set('views', path.resolve(__dirname, 'client', 'views')); // client/views

//Servidor estatico de archivos de la carpeta client
app.use(express.static(path.resolve(__dirname, 'client')));

var users = [];
io.on('connection', function(socket) {
    var username = '';
    console.log("A User has Connected!");
    
    socket.on('request-users', function() {
        socket.emit('users', {users: users});
    });
    
    socket.on('message', function(data) {
        io.emit('message', {username: username, message: data.message});
    });
    
    socket.on('add-user', function(data) {
        if(users.indexOf(data.username) == -1) {
          io.emit('add-user', {
            username: data.username
          });
          username = data.username;
          users.push(data.username);
        } else {
          socket.emit('prompt-username', {
            message: 'User Already Exists'
          });
        }
    });
    
    socket.on('disconnect', function() {
        console.log(username + ' has disconnected!');
        users.splice(users.indexOf(username), 1);
        io.emit('remove-user', {username: username});
    });
});

//Se establece la primera ruta
app.get('/', function(req, res) {
    res.render('index.ejs');
});

var api = express.Router();
require('./server/routes/api')(api);
app.use('/api', api);

app.get('/*', function(req, res) {
    res.render('index.ejs');
});

//Escucha las solicitudes entrantes por el puerto 8080
http.listen(port, function(){
    console.log("SERVER RUNNING...");
    console.log("PORT: " + port);
});