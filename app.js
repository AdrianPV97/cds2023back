const multer = require('multer');
const sharp = require('sharp');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el middleware cors
const port = 4000;
//const dbConection = require('./drivers/bdd');
const { connectToDatabase } = require('./drivers/test');
app.use(express.json({ limit: '10mb' }));



const storage = multer.memoryStorage(); // Almacenar archivos en memoria
const upload = multer({storage:storage});




app.use(bodyParser.json());
//app.use(cors());


function obtenerNinoPorId(ninos, id) {
    const ninoEncontrado = ninos.find(nino => nino.id === id);
    return ninoEncontrado || null; // Devuelve el objeto encontrado o null si no se encuentra
}

app.get('/resumen', async (req,res) =>{
    try {
        
        const connection = await connectToDatabase();
    
        
        const [rows, fields] = await connection.execute('CALL getResume()');
    
        
        res.json(rows);
    
        await connection.end();
      } catch (error) {
        console.error('Error en el ejemplo de uso:', error);
      }
})

app.get('/test', async (req, res) =>{

    try {
        
        const connection = await connectToDatabase();
    
        
        const [rows, fields] = await connection.execute('CALL getUser(3)');
    
        
        res.json(rows[0]);
    
        await connection.end();
      } catch (error) {
        console.error('Error en el ejemplo de uso:', error);
      }
    
})


app.get('/test', async (req, res) =>{

    try {
        // Conectarse a la base de datos
        const connection = await connectToDatabase();
    
        // Ejecutar el query SELECT NOW()
        const [rows, fields] = await connection.execute('CALL getUser(3)');
    
        // Imprimir el resultado
        //console.log('Resultado del query:', rows);
        res.json(rows[0]);
    
        // No olvides cerrar la conexión cuando hayas terminado
        await connection.end();
      } catch (error) {
        console.error('Error en el ejemplo de uso:', error);
      }
    // dbConection.query('SELECT * FROM test', (err, rows)=>{
    //     if (err) {
    //         console.error('Error al realizar la consulta: ', err);
    //         return;
    //       }
         
    //       console.log('Resultados: ', rows);
    // });
    
})

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
    // const foto = req.data.foto;
    // dbConection.query('SELECT * FROM paquete WHERE tipo="Juguete" AND grupo="M10"', (err, rows)=>{
    //     if (err) {
    //         console.error('Error al realizar la consulta: ', err);
    //         return;
    //       }
    //       if(!rows[0]){
    //         dbConection.query("INSERT INTO paquete (fecha, unico, donador, tipo, grupo, evidencia, indice) VALUES (NOW(), 565911, NULL, 'Juguete', 'M10', 'Evidencia', 1);", (err, row)=>{
    //             if (err) {
    //                 console.error('Error al realizar la consulta: ', err);
    //                 return;
    //               }else{
    //                 console.log("Guardado!")
    //               }
    //         })
    //       }else{
    //         dbConection.query("SELECT indice FROM paquete WHERE tipo = 'Juguete' AND grupo ='M10'  ", (err, row)=>{
    //             if (err) {
    //                 console.error('Error al realizar la consulta: ', err);
    //                 return;
    //               }else{
    //                 dbConection.query(`INSERT INTO paquete (fecha, unico, donador, tipo, grupo, evidencia, indice) VALUES (NOW(), 565911, NULL, 'Juguete', 'M10', 'Evidencia', ${row[0].indice + 1});`, (err, row)=>{
    //                     if (err) {
    //                         console.error('Error al realizar la consulta: ', err);
    //                         return;
    //                       }else{
    //                         console.log("Guardado consecutivo!")
    //                       }});
                  
    //               }});
    //       }
    //       //
    // });
    
    

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

app.get('/donacion', async (req, res)=>{
    try {
        // Conectarse a la base de datos
        const connection = await connectToDatabase();
    
        // Ejecutar el query SELECT NOW()
        const [rows, fields] = await connection.execute('SELECT tipo, grupo, id, evidencia, indice FROM paquete');
    
        // Imprimir el resultado
        //console.log('Resultado del query:', rows);
        res.json(rows);
    
        // No olvides cerrar la conexión cuando hayas terminado
        await connection.end();
      } catch (error) {
        console.error('Error en el ejemplo de uso:', error);
      }
    // dbConection.query('SELECT tipo, GE, idPaquete, evidencia, indice FROM paquete;', (err,rows) =>{
    //     if (err) {
    //         console.error('Error al realizar la consulta: ', err);
    //         return;
    //     }
            
    //     //console.log('Resultados: ', rows);
    //     res.send(rows)
    // });
});

app.get('/donacion/:id',  async (req, res) =>{
    try {
        const id = req.params.id;
        // Conectarse a la base de datos
        const connection = await connectToDatabase();
    
        // Ejecutar el query SELECT NOW()
        const [rows, fields] = await connection.execute(`SELECT * FROM paquete WHERE id = ${id}`);
    
        // Imprimir el resultado
        console.log('Resultado del query:', rows);
        res.json(rows[0]);
    
        // No olvides cerrar la conexión cuando hayas terminado
        await connection.end();
      } catch (error) {
        console.error('Error en el ejemplo de uso:', error);
      }
    // const id = req.params.id;
    // dbConection.query(`SELECT * FROM paquete WHERE idPaquete = ${id}`, (err,rows) =>{
    // if (err) {
    //     console.error('Error al realizar la consulta: ', err);
    //     return;
    // }
    // res.send(rows[0]);
    // })
    //res.json(response);
});

//Devuelve todos los niños registrados
app.get('/ninos', async (req, res) =>{
    try {
        // Conectarse a la base de datos
        const connection = await connectToDatabase();
    
        // Ejecutar el query SELECT NOW()
        const [rows, fields] = await connection.execute('CALL getUsers()');
    
        // Imprimir el resultado
        //console.log('Resultado del query:', rows);
        res.json(rows[0]);
    
        // No olvides cerrar la conexión cuando hayas terminado
        await connection.end();
      } catch (error) {
        console.error('Error en el ejemplo de uso:', error);
      }
    // dbConection.query('SELECT n.nombre, n.genero, n.edad  d.colonia, d.municipio, d.estado FROM ninos n ', (err, rows)=>{
    //     if (err) {
    //         console.error('Error al realizar la consulta: ', err);
    //         return;
    //       }
         
    //       console.log('Resultados: ', rows);
    // });
    // res.sendStatus(200);
    
    // dbConection.query('CALL getUsers', (err,rows) =>{
    //     if (err) {
    //         console.error('Error al realizar la consulta: ', err);
    //         return;
    //     }     
    //     //console.log('Resultados: ', rows);
    //     res.send(rows[0])
    // });
    // //console.log(req);
    // //res.json(ninos);
});

app.get('/ninos/:id', async (req, res) =>{
    const id = req.params.id;
    try {
        // Conectarse a la base de datos
        const connection = await connectToDatabase();
    
        // Ejecutar el query SELECT NOW()
        const [rows, fields] = await connection.execute(`CALL getUser(${id})`);
    
        // Imprimir el resultado
        //console.log('Resultado del query:', rows);
        res.json(rows[0]);
    
        // No olvides cerrar la conexión cuando hayas terminado
        await connection.end();
      } catch (error) {
        console.error('Error en el ejemplo de uso:', error);
      }
    // dbConection.query(`CALL getUser(${id})`, (err,rows) =>{
    // if (err) {
    //     console.error('Error al realizar la consulta: ', err);
    //     return;
    // }
    // res.send(rows[0]);
    // })
    //res.json(response);
});

app.listen(4000,() => {
    console.log(`Server on port 3000`);
});