const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config()

const dbConfig = {
    host: 'srv487.hstgr.io',
    user: 'u775393205_cdsroot',
    password: 'q5[Mut|K>',
    database: 'u775393205_cds2023back',
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
  };



  async function connectToDatabase() {
    try {
      const connection = await mysql.createConnection(dbConfig);
     // console.log('Conexión a la base de datos establecida');
      
      // Manejar eventos de cierre de conexión inesperado
      connection.on('error', (err) => {
        console.error('Error de conexión:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          // La conexión con la base de datos se ha perdido, intentar reconectar
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
