const { query } = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config()

// const connection = mysql.createPool(process.env.DATABASE_URL);

// connection.query('select NOW()',  function (err, results) {
//     console.log(results)
//   })
const connection = mysql.createPool({
// host: 'mysqldb',
// port:3306,
// user: 'root',
// password: "50p0r733",
// database: 'cds2023'
  
host: 'localhost',
port:3306,
user: 'root',
password: "50p0r733",
database: 'cds2023'
})

// const connection = mysql.createConnection({
//   host: '172.18.0.2',
//   port:3306,
//   user: 'root',
//   password: "50p0r733",
//   database: 'cds2023'
  
//   // host: 'localhost',
//   // port:3306,
//   // user: 'root',
//   // password: "50p0r733",
//   // database: 'cds2023'
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error de conexión: ', err);
//     return;
//   }
//   console.log('Conectado a la base de datos!');
// });

module.exports = connection;

// const cadena = 'CALL newUser(?, ?)';
// const values = ['Oscar Cortes', 'ocortes@emida.com']
// connection.query(cadena, values, (err, rows) => {
//     if (err) {
//       console.error('Error al realizar la consulta: ', err);
//       return;
//     }

//     console.log('Resultados: ', rows);
//   });