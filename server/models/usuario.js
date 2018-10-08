const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

//                                                          //Declaración de un esquema.
let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        //                                                  //Debe especificarse que propiedad debe ser única.
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        //                                                  //Opciones válidas para el parámetro.
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//                                                          //Función que modifica el userSchema
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    //                                                      //Omite el password para no mostrarlo en el JSON.
    delete userObject.password;

    return userObject;
}

//                                                          //{PATH} especifica el parámetro que debe ser único.
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

//                                                          //'Usuario' es el nombre físico del modelo configurado como
//                                                          //      'usuarioSchema'
module.exports = mongoose.model('Usuario', usuarioSchema);