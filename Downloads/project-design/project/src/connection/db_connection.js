import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',   
    user: 'root',        
    password: 'PUC@1234',
    database: 'ecommerce'      
};

const pool = mysql.createPool(dbConfig);

async function testConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('🎉 Conexão com o banco de dados MySQL bem-sucedida!');

        const [rows] = await connection.execute('SELECT "Conexão OK" as Teste;');
        console.log('Resultado da consulta de teste:', rows[0].Teste);

    } catch (error) {
        console.error('❌ Erro ao conectar com o banco de dados:', error.message);
    } finally {
        if (connection) {
            connection.release();
            console.log('🔌 Conexão liberada.');
        }
    }
}

testConnection();

export default pool;
