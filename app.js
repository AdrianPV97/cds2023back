const multer = require('multer');
const sharp = require('sharp');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el middleware cors
const port = 4000;


const storage = multer.memoryStorage(); // Almacenar archivos en memoria
const upload = multer({storage:storage});

const ninos = [
    {
        "id":"1",
        "nombre":"Niño 1",
        "domicilio":"domicilio mz 12",
        "grupo":"M5",
        "ciudad":"CDMX"
    },

    {
        "id":"2",
        "nombre":"Niño 2",
        "domicilio":"domicilio av principal",
        "grupo":"M10",
        "ciudad":"OAXACA"
    },

    {
        "id":"3",
        "nombre":"Niño 3",
        "domicilio":"domicilio #14, Colonia",
        "grupo":"F8",
        "ciudad":"PUEBLA"
    },

    {
        "id":"4",
        "nombre":"Niño 4",
        "domicilio":"domicilio mz 12",
        "grupo":"F3",
        "ciudad":"CUERNAVACA"
    },

    {
        "id":"5",
        "nombre":"Niño 5",
        "domicilio":"domicilio av principal",
        "grupo":"M6",
        "ciudad":"QUERETARO"
    },

    {
        "id":"6",
        "nombre":"Niño 6",
        "domicilio":"domicilio #14, Colonia",
        "grupo":"F2",
        "ciudad":"CDMX"
    },
    {
        "id":"7",
        "nombre":"Niño 7",
        "domicilio":"domicilio mz 12",
        "grupo":"M10",
        "ciudad":"MORELOS"
    },
    {
        "id":"8",
        "nombre":"Niño 8",
        "domicilio":"domicilio av principal",
        "grupo":"F5",
        "ciudad":"OAXACA"
    }
]



app.use(bodyParser.json());
//app.use(cors());


function obtenerNinoPorId(ninos, id) {
    const ninoEncontrado = ninos.find(nino => nino.id === id);
    return ninoEncontrado || null; // Devuelve el objeto encontrado o null si no se encuentra
}


app.post('/', (req, res) =>{
    res.sendStatus(200);
    console.log(req.body)
});

app.post('/donacion', upload.single('imagen'),  (req, res) =>{
    const file = req.file;
    console.log(file);
    var milliseconds = new Date().getTime();
    fs.writeFileSync(`./uploads/${milliseconds}.jpg`, file.buffer);
    // const fileBuffer = req.file.buffer;
    // console.log(fileBuffer);
    res.status(200).json({ message: 'Archivo recibido exitosamente' });
});

app.get('/ninoss', (req, res) =>{
    console.log(req);
    res.json(ninos);
});

app.get('/ninos/:id', (req, res) =>{
    const id = req.params.id;
    console.log(id);
    const response = ninos.find(nino => nino.id === id);
    console.log(response);
    res.json(response);
});

app.listen(port || 4000,() => {
    console.log(`Server on port 4000`);
});