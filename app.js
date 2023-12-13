const multer = require('multer');
const sharp = require('sharp');
const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el middleware cors
const port = 4000;
//const dbConection = require('./drivers/bdd');
const { connectToDatabase } = require('./drivers/test');
app.use(express.json({ limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.memoryStorage(); // Almacenar archivos en memoria
const upload = multer({storage:storage});





app.use(bodyParser.json());




/*Funciones */

function obtenerNinoPorId(ninos, id) {
  const ninoEncontrado = ninos.find(nino => nino.id === id);
  return ninoEncontrado || null; // Devuelve el objeto encontrado o null si no se encuentra
}



/* GET*/

app.get('/resumen', async (req,res) =>{
    try {
        const connection = await connectToDatabase();
        const [rows, fields] = await connection.execute('CALL getResume()');
        res.json(rows);
        await connection.end();
      } catch (error) {
        console.error('Error en el ejemplo de uso:', error);
      }
});


app.get('/donacion', async (req, res)=>{
  try {
      const connection = await connectToDatabase();
      const [rows, fields] = await connection.execute('SELECT tipo, grupo, id, evidencia, indice, voluntario FROM paquete');
      res.json(rows);
      await connection.end();
    } catch (error) {
      console.error('Error en el ejemplo de uso:', error);
    }
});

app.get('/donacion/:id',  async (req, res) =>{
  try {
      const id = req.params.id;
      const connection = await connectToDatabase();
      const [rows, fields] = await connection.execute(`SELECT * FROM paquete WHERE id = ${id}`);
      console.log('Resultado del query:', rows);
      res.json(rows[0]);
      await connection.end();
    } catch (error) {
      console.error('Error en el ejemplo de uso:', error);
    }
});

app.get('/ninos', async (req, res) =>{
  try {
      const connection = await connectToDatabase();
      const [rows, fields] = await connection.execute('CALL getUsers()');
      res.json(rows[0]);
      await connection.end();
    } catch (error) {
      console.error('Error en el ejemplo de uso:', error);
    }
});

app.get('/ninos/:id', async (req, res) =>{
  const id = req.params.id;
  try {
      const connection = await connectToDatabase();
      const [rows, fields] = await connection.execute(`CALL getUser(${id})`);
      res.json(rows[0]);
      await connection.end();
    } catch (error) {
      console.error('Error en el ejemplo de uso:', error);
    }

});

app.get('/paqueteid', async (req, res) =>{
  try {
      const connection = await connectToDatabase();
      const [rows, fields] = await connection.execute('SELECT tipo, grupo, indice FROM paquete ORDER BY id DESC LIMIT 1');
      res.json(rows[0]);
      await connection.end();
    } catch (error) {
      console.error('Error en el ejemplo de uso:', error);
    }

});

app.get('/image/:name', (req, res) =>{
  const nombreArchivo = req.params.name;
  //const nombreArchivo = '';
  const rutaImagen = path.join(__dirname, 'uploads', nombreArchivo);

  if (fs.existsSync(rutaImagen)) {
    res.sendFile(rutaImagen);
  } else {
    // Manejar caso donde la imagen no existe
    res.status(404).send('Imagen no encontrada');
  }
});


/*POST */
app.post('/login', (req, res) =>{
    
    res.sendStatus(200);
    //console.log(req.body)
});

app.post('/', (req, res) =>{
    
    dbConection.query('SELECT * FROM familia', (err,rows) =>{
        if (err) {
              console.error('Error al realizar la consulta: ', err);
              return;
            }
            
            console.log('Resultados: ', rows);
    });
    res.sendStatus(200);
    //console.log(req.body)
});

app.post('/registropaquete', async (req, res) => {
    try {
        // Conectarse a la base de datos
        const connection = await connectToDatabase();
        
        const unique = new Date().getTime();
        const tipo = req.body.tipo;
        const generoEdad = req.body.group;
        const evidencia = req.body.foto;

        const values = [unique, tipo, generoEdad, evidencia];
        
        // Ejecutar el query SELECT NOW()
        const [rows, fields] = await connection.execute('CALL regPaquete(?,?,?,?)', values);
    
        // Imprimir el resultado
        //console.log('Resultado del query:', rows);
        res.sendStatus(200);
    
        // No olvides cerrar la conexión cuando hayas terminado
        await connection.end();
      } catch (error) {
        console.error('Error en el ejemplo de uso:', error);
      }
});


app.post('/donacion',  (req, res) =>{
    try {
        const base64Data = req.body.data;
        const buffer = Buffer.from(base64Data, 'base64');
    
        var milliseconds = new Date().getTime();
        const fileName = `${milliseconds}.jpg`;
        sharp(buffer)
          .toFormat('jpeg')
          .toFile(`./uploads/${fileName}`, (err, info) => {
            if (err) {
              console.error('Error al guardar la imagen:', err);
              res.status(500).send('Error interno del servidor.');
            } else {
              //console.log('Imagen guardada exitosamente:', info);
              res.status(200).send(`${fileName}`);
            }
          });
      } catch (error) {
        console.error('Error al procesar datos Base64:', error);
        res.status(500).send('Error interno del servidor.');
      }
});





app.listen(3000,() => {
    console.log(`Server on port 3000`);
});