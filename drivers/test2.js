const { connectToDatabase } = require('./test');

async function exampleUsage() {
    try {
      // Conectarse a la base de datos
      const connection = await connectToDatabase();
  
      // Ejecutar el query SELECT NOW()
      const [rows, fields] = await connection.execute('SELECT NOW()');
  
      // Imprimir el resultado
      console.log('Resultado del query:', rows);
  
      // No olvides cerrar la conexión cuando hayas terminado
      await connection.end();
    } catch (error) {
      console.error('Error en el ejemplo de uso:', error);
    }
  }
  
  exampleUsage();

exampleUsage();