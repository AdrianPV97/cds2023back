const { query } = require('express');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port:3307,
  user: 'root',
  password: '50p0r733',
  database: 'cds2023'
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ', err);
    return;
  }


  console.log('Conectado a la base de datos!');
});

const cadena = 'CALL newUser(?, ?)';
const values = ['Oscar Cortes', 'ocortes@emida.com']
connection.query(cadena, values, (err, rows) => {
    if (err) {
      console.error('Error al realizar la consulta: ', err);
      return;
    }

    console.log('Resultados: ', rows);
  });