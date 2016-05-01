//https://github.com/mac8905
//Author: Miguel Caro
//NodeJS Server

//Inicializacion del framework Express
var express = require("express");
var app  = express();

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
app.listen(port, function(){
    console.log("SERVER RUNNING...");
    console.log("PORT: " + port);
});