const path = require('path');
const fs = require('fs');
const {response} = require('express');

const {subirArchivo} = require("../helpers/subir-archivo");
const {Producto, Usuario} = require("../models");
const {model} = require("mongoose");

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const cargarArchivo = async (req, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            ok: true,
            nombre
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Error al subir archivo',
            error
        });
    }

}


const actualizarImagen = async (req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Coleccion no valida'
            });
    }

    //limpiar imagenes previas


    console.log(modelo.img);
    if (fs.existsSync(modelo.img)) {
        fs.unlinkSync(modelo.img);
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const actualizarImagenCloudinary = async (req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Coleccion no valida'
            });
    }

    //limpiar imagenes previas

    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        console.log(public_id);

        await cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;


    await modelo.save();

    res.json(modelo);
}


const mostrarImagen = async (req, res) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Coleccion no valida'
            });
    }

    //limpiar imagenes previas

    if (modelo.img) {
        if (fs.existsSync(modelo.img)) {
            return res.sendFile(path.resolve(modelo.img));
        }
    }

    const defaultImg = path.join(`${__dirname}/../assets/image-not-found.png`);
    res.sendFile(defaultImg);

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}