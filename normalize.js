const { connectToDatabase } = require('./drivers/test');


async function consulta(){
    try{
        const connection = await connectToDatabase();
        const [rows, fields] = await connection.execute('SELECT * FROM ninos WHERE paquete IS NULL');
        for (const nino of rows) {
            const [columnas, campos] = await connection.execute(`SELECT id FROM paquete WHERE grupo = '${nino.grupo}' AND asignado IS NULL ORDER BY id ASC LIMIT 1;`);
            if(columnas.length > 0){
                //const [registro, dato] = await connection.execute(`UPDATE ninos SET paquete = ${columnas[0].id} WHERE id = ${nino.id}; UPDATE paquete SET asignado = ${nino.id} WHERE id = ${columnas[0].id};`);    
                const [registro, dato] = await connection.execute(`CALL asigment(${nino.id}, ${columnas[0].id})`);
                console.log("Dato actualizado");
            }
            
        }
        await connection.end();
    }catch(err){
        console.log(err);
    }
}

consulta();