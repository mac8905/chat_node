// Se inicializa mongoDB
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Se crea un nuevo documento
var customerSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    }
});

// Se exporta el documento Customer
module.exports = mongoose.model('Customer', customerSchema);