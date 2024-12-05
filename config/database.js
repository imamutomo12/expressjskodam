const mysql = require('mysql2');
const conection = mysql.createConnection({
    host:'localhost',
    user:'admin',
    password:'password',
    database:'db_kodam'
})

conection.connect((err)=>{
    if (err) throw err;
    console.log('MYSQL database connected')
});
module.exports = conection;