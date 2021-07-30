const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' )=>{

    return new Promise( (resolve, reject) => {
        console.log('req.files >>>', files);
        if ( !files ) {
            reject({
                msg: 'No se adjunto ningun archivo...'
            });
            return;
        }
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length -1];
        console.log(nombreCortado);
    
        if ( !extensionesValidas.includes(extension) ) {
            reject({
                msg:`La extension ${extension} no es permitida, ${extensionesValidas}`
            });
            return;
        }
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
    
        archivo.mv(uploadPath,  (err) => {
            if (err) {
                reject({err});
                return;
            }
            //resolve( uploadPath );
            resolve ( nombreTemp );
        });
    });
}

module.exports = {
    subirArchivo
}