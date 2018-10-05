require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/*TIPOS DE PETICIÓN*/
app.get('/usuario', function(req, res) {
    //                                                      //Envia un archivo tipo JSON.
    res.json('get Usuario');
});

//                                                          //Crear nuevos registros.
app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }
});

//                                                          //Actualizar registros.
//                                                          //Se debe específicar el id del usuario dentro del path.
app.put('/usuario/:id', function(req, res) {

    //                                                      //La variabe dentro 'params' debe ser la del path.
    let id = req.params.id;
    res.json({
        id
    });
});

//                                                          //Cambia el estado de un registro para que no este 
//                                                          //      disponible (borra registros).
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});