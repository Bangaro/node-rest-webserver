const {v4: uuidv4} = require("uuid");
const path = require("path");


const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const {archivo} = files;

        if (!archivo) {
            reject('No hay ningun archivo a subir');
        }

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject(`Extension ${extension} no valida, extensiones permitidas ${extensionesValidas.join(', ')}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, function (err) {
            if (err) {
                reject(err);
            }
            resolve(uploadPath);
        });
    });

}

module.exports = {
    subirArchivo
};