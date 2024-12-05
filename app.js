const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//random kodam picker function

app.post('/api/kodam', (req,res)=>{
    // variabel penampung data dan query sql
    const data = {...req.body};
    const querysql = 'INSERT INTO kodam SET ?';


    //jalankan query
    koneksi.query(querysql, data, (err,rows,field)=>{
        // error handling
        if (err) {
            return res.status(500).json({message : 'gagal insert data!'})
        };
        
        res.status(201).json({success: true, message: 'Berhasil insert data!'});

    })
});

app.put('/api/kodam/:id',(req,res)=>{
    const data = {...req.body};
    const querySearch = 'SELECT * FROM kodam WHERE id = ?';
    const queryUpdate = 'UPDATE kodam SET ? WHERE id = ?';

    koneksi.query(querySearch, req.params.id, (err, rows, field )=> {
        if (err) {
            return res.status(500).json({message:'Ada Kesalahan', error:err});
        }

        if (rows.length) {
            koneksi.query(queryUpdate,[data,req.params.id],(err,rowss,field)=>{
                if (err) {
                    return res.status(500).json({message:'Gagal Update Data!',error:err});
                };

                res.status(200).json({success:true,message : 'Berhasil Update Data '});
            });
        }else{
            return res.status(404).json({message:'Data tidak ditemukan',success:false})
        }

      
    });
});

app.delete('/api/bootcamp/:id',(req,res)=>{
    const querySearch = 'SELECT * FROM kodam WHERE id =? ';
    const queryDelete = 'DELETE FROM kodam WHERE id = ?';

    koneksi.query(querySearch, req.params.id, (err, rows, field )=> {
        if (err) {
            return res.status(500).json({message:'Ada Kesalahan', error:err});
        }

        if (rows.length) {
            koneksi.query(queryDelete,req.params.id,(err,rowss,field)=>{
                if (err) {
                    return res.status(500).json({message:'Gagal delete Data!',error:err});
                };

                res.status(200).json({success:true,message : 'Berhasil delete Data '});
            });
        } else {
            return res.status(404).json({message:'Data tidak ditemukan',success:false})
        }

      
    });

})

app.get('/kodam/:nama', (req, res) => {
    const name = req.params.nama;

    // Query untuk menghitung jumlah record dalam tabel
    const countQuery = 'SELECT COUNT(*) AS recordCount FROM kodam';

    koneksi.query(countQuery, (err, countResult) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan saat menghitung jumlah record', error: err });
        }

        // Ambil jumlah record dari hasil query
        const recordCount = countResult[0].recordCount;

        // Tetapkan maxSum berdasarkan jumlah record
        const maxSum = recordCount;

        // Fungsi untuk menghitung nilai berbasis nama
        function getNameValue(name) {
            name = name.toLowerCase(); // Pastikan semua huruf dalam huruf kecil

            let sum = 0;

            // Hitung jumlah posisi huruf
            for (let i = 0; i < name.length; i++) {
                const char = name[i];
                if (char >= 'a' && char <= 'z') {
                    const value = char.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
                    sum += value;
                }
            }

            // Terapkan bobot berdasarkan panjang nama
            let weightedSum = sum / Math.max(name.length, 1);

            // Batasi weightedSum hingga maxSum
            return Math.min(maxSum, Math.floor(weightedSum));
        }

        const querysql = 'SELECT * FROM kodam WHERE id = ?';
        const idValue = getNameValue(name); // Hitung nilai ID dari nama

        koneksi.query(querysql, idValue, (err, rows, field) => {
            if (err) {
                return res.status(500).json({ message: 'Ada kesalahan', error: err });
            }

            res.status(200).json({ success: true, data: rows });
        });
    });
});



app.listen(PORT, () => console.log(`server running at port : ${PORT}`));