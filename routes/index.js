var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');
const fs = require('fs');
const multer = require('multer');
const path = require('path'); 
const bcrypt = require('bcrypt');

var Model_Users = require('../Model/Model_Users.js');
var Model_Users_Kantin = require('../model/Model_Users_Kantin.js');
var Model_Menu = require('../model/Model_Menu.js');

const queryPromise = (sql, values) => {
  return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results) => {
          if (error) return reject(error);
          resolve(results);
      });
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images/users')
  },
  filename: (req, file, cb) => {
      console.log(file)
      cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
      let rows = await Model_Menu.getAll();
      let produkTerbaru = await queryPromise('SELECT * FROM menu ORDER BY id_menu DESC LIMIT 6');
      res.render('catering/index', {
          data: rows,
          produkTerbaru: produkTerbaru // Produk terbaru

      });
  } catch (error) {
      console.error("Error:", error);
      req.flash('invalid', 'Terjadi kesalahan saat memuat data pengguna');
      res.redirect('/login');
  }
});

router.get('/register', function(req, res, next) {
  res.render('auth/register');
})
router.get('/login', function(req, res, next) {
  res.render('auth/login');
})

router.get('/registerkantin', function(req, res, next) {
  res.render('auth/registerkantin');
});

router.get('/loginkantin', function(req, res, next) {
  res.render('auth/loginkantin');
})

router.post('/saveusers', upload.single("gambar_users"), async (req, res) => {
  try {
    let { nama_users, alamat_users, no_telp_users, email_users, password_users } = req.body;
    let enkripsi = await bcrypt.hash(password_users, 10);
    let Data = {
      nama_users,
      alamat_users,
      no_telp_users,
      email_users,
      password_users: enkripsi,
      level_users: 1,
      gambar_users: req.file.filename
    };
    await Model_Users.Store(Data);
    req.flash('success', 'Berhasil Register');
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
});

router.post('/saveuserskantin', upload.single("gambar_users"), async (req, res) => {
  try {
    let { nama_users, nama_panggilan_users, no_telp_users, jenis_kelamin, email_users, password_users } = req.body;
    let enkripsi = await bcrypt.hash(password_users, 10);
    let Data = {
      nama_users,
      nama_panggilan_users,
      no_telp_users,
      jenis_kelamin,
      email_users,
      password_users: enkripsi,
      gambar_users: req.file.filename
    };
    await Model_Users_Kantin.Store(Data);
    req.flash('success', 'Berhasil Register');
    res.redirect('/loginkantin');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/registerkantin');
  }
});

router.post('/log', async (req,res) => {
  let {email_users, password_users } = req.body;
  try {
    let Data = await Model_Users.Login(email_users);
    if(Data.length > 0) {
      let enkripsi = Data[0].password_users;
      let cek = await bcrypt.compare(password_users, enkripsi);
      if(cek) {
        req.session.userId = Data[0].id_users;
        req.session.level = Data[0].level_users;
        req.session.gambar_users= Data[0].gambar_users;
        req.session.nama_users = Data[0].nama_users;
        req.session.alamat_users = Data[0].alamat_users;
        req.session.no_telp_users = Data[0].no_telp_users;
        req.session.email_users = Data[0].email_users;
        // tambahkan kondisi pengecekan level pada user yang login
        if(Data[0].level_users == 1){
          req.flash('success','Berhasil login');
          res.redirect('/superusers');
          //console.log(Data[0]);
        }else if(Data[0].level_users == 2){
          req.flash('success', 'Berhasil login');
          res.redirect('/users');
        }else{
          res.redirect('/login');
          console.log(Data[0]);
        }
      } else {
        req.flash('failure', 'Email atau password salah');
        res.redirect('/login');
      }
    } else {
      req.flash('failure', 'Akun tidak ditemukan');
      res.redirect('/login');
    }
  } catch (err) {
    res.redirect('/login');
    req.flash('failure', 'Error pada fungsi');
    console.log(err);
  }
})

router.post('/logkantin', async (req,res) => {
  let {email_users, password_users } = req.body;
  try {
    let Data = await Model_Users_Kantin.Login(email_users);
    if(Data.length > 0) {
      let enkripsi = Data[0].password_users;
      let cek = await bcrypt.compare(password_users, enkripsi);
      if(cek) {
        req.session.userId = Data[0].id_users;
        // req.session.level = Data[0].level_users;
        req.session.gambar_users = Data[0].gambar_users;
        req.session.nama_users = Data[0].nama_users;
        req.session.nama_panggilan_users = Data[0].nama_panggilan_users;
        req.session.no_telp_users = Data[0].no_telp_users;
        req.session.email_users = Data[0].email_users;
        // tambahkan kondisi pengecekan level pada user yang logi
          req.flash('success','Berhasil login');
          res.redirect('/catering');
          //console.log(Data[0]);
      } else {
        req.flash('failure', 'Email atau password salah');
        res.redirect('/loginkantin');
      }
    } else {
      req.flash('failure', 'Akun tidak ditemukan');
      res.redirect('/loginkantin');
    }
  } catch (err) {
    res.redirect('/loginkantin');
    req.flash('failure', 'Error pada fungsi');
    console.log(err);
  }
})



router.post("/updateuserskantin/:id",  upload.single("gambar_users"), async (req, res, next) => {
  try {
      const id = req.params.id;
      let filebaru = req.file ? req.file.filename : null;
      let rows = await Model_Users_Kantin.getId(id);
      const namaFileLama = rows[0].gambar_users;

      if (filebaru && namaFileLama) {
          const pathFileLama = path.join(__dirname, '../public/images/users', namaFileLama);
          fs.unlinkSync(pathFileLama);
      }

      let {
        nama_users,
        nama_panggilan_users,
        no_telp_users,
        jenis_kelamin,
        email_users,
      } = req.body;
      
      let gambar_users = filebaru || namaFileLama

      let Data = {
          nama_users: nama_users,
          nama_panggilan_users: nama_panggilan_users,
          no_telp_users: no_telp_users,
          jenis_kelamin: jenis_kelamin,
          email_users: email_users,
          gambar_users
      }
      console.log(req.body);
      console.log(Data);
      await Model_Users_Kantin.Update(id, Data);
      req.flash("success", "Berhasil mengupdate data profil");
      res.redirect("/catering/profil");
  } catch (error) {
      console.log(error);
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if(err) {
      console.error(err);
    } else {
      res.redirect('/loginkantin');
    }
  });
});


module.exports = router;