const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

/*TIPOS DE PETICIÓN*/
//                                                          //Obtiene un registro de la DB.
app.get('/usuario', function(req, res) {
    //                                                      //En 'query' se almacenan las variables entrantes en url.
    console.log(req.query);
    //                                                      //Especifíca desde donde hacer la búsqueda (default 0).
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //                                                      //Busca todos los elementos de esa colección. El segundo
    //                                                      //      argumento indca que parametros mostrar.
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        //                                                  //Indica cuantos registros saltarse.
        .skip(desde)
        //                                                  //Indica cuantos registros obtener.    
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //                                              //Calcula el número de registros en una colección. Debe
            //                                              //      el mismo criterio de búsqueda que en función 'find'.
            Usuario.count({ estado: true }, (err, conteo) => {
                //                                          //Envia un archivo tipo JSON.
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });

        });
});

//                                                          //Crear nuevos registros.
app.post('/usuario', function(req, res) {
    let body = req.body;

    //                                                      //Definimos un usuario con los atributos necesarios.
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //                                                  //Hace hash de forma síncrona.
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //                                                  //Para no mostrar el password del usuario.
        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }
});

//                                                          //Actualizar registros.
//                                                          //Se debe específicar el id del usuario dentro del path.
app.put('/usuario/:id', function(req, res) {

    //                                                      //La variabe dentro 'params' debe ser la del path.
    let id = req.params.id;
    //                                                      //Filtra un objeto con opciones que si se pueden actualizar.
    let body = _.pick(req.body, ['nombre', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {
            //                                              //Muestra el objeto con los nuevos datos.    
            new: true,
            //                                              //Aplica las validaciones definidas en el Schema.
            runValidators: true
        },
        (err, usuarioBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBD
            });
        });
});

//                                                          //Cambia el estado de un registro para que no este 
//                                                          //      disponible (borra registros).
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    /*Borrado físico de  la BD*/
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    /*Borrado cambiando estado del registro*/
    /*EJERCICIO*/
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }


        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })
});

module.exports = app;