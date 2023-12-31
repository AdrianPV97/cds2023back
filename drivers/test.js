const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config()

const dbConfig = {
    host: 'your_host',
    user: 'your_user',
    password: 'your_password',
    database: 'your_DB',
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
  };



  async function connectToDatabase() {
    try {
      const connection = await mysql.createConnection(dbConfig);
      connection.on('error', (err) => {
        console.error('Error de conexión:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          connectToDatabase();
        } else {
          throw err;
        }
      });
  
      return connection;
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      throw error;
    }
  }

  module.exports = {
    connectToDatabase
  };
