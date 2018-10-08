/*Declaración global*/

//===================
//Puerto
//===================
process.env.PORT = process.env.PORT || 3000;

//===================
//Entorno
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
//Base de datos
//===================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:1a2b3c4d5e6f@ds239681.mlab.com:39681/cafe'
}

process.env.URLDB = urlDB;