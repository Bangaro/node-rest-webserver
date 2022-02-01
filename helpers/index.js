const dbValidators = require('../db/validators');
const generarJWT = require('../db/generar-jwt');
const googleVerify = require('../db/google-verify');
const subirArchivo = require('../db/subir-archivo');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}