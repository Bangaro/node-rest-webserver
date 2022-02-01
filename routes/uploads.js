const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const {cargarArchivo, mostrarImagen, actualizarImagenCloudinary} = require("../controllers/uploads");
const {coleccionesPermitidas} = require("../helpers/db-validators");
const {validarArchivo} = require("../middlewares/validar-archivo");

const router = Router();


router.post('/', [
    validarArchivo
], cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion', 'Coleccion no valida').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
        check('id', 'El id debe ser de Mongo').isMongoId(),
        check('coleccion', 'Coleccion no valida').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
        validarCampos
    ],
    mostrarImagen);

module.exports = router;