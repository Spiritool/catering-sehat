const express = require("express");
const router = express.Router();
const Model_Pembayaran = require('../Model/Model_Pembayaran.js');
const Model_Menu = require("../Model/Model_Menu.js");
const Model_Users = require("../Model/Model_Users.js");

router.get('/', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Pembayaran.getAll();
        let rows2 = await Model_Users.getId(id);
        res.render('pembayaran/index', {
            data: rows,
            data2: rows2
            
        });
    } catch (error) {
        next(error);
    }
});

// router.get('/create', async function (req, res, next) {
//     try {
//         let level_users = req.session.level;
//         let id = req.session.userId;
//         let Data = await Model_Pembayaran.getAll();
//         // if(Data[0].level_users == "2") {
//         res.render('pembayaran/create', {
//             nama_service: '',
//             data: Data,
//         })
//         // }
//         // else if (Data[0].level_users == "1"){
//         //     req.flash('failure', 'Anda bukan admin');
//         //     res.redirect('/sevice')
//         // }
//     } catch (error) {
//         console.log(error);
//     }
// })

// router.post('/store', async function (req, res, next) {
//     try {
//         let { pembayaran } = req.body;
        
//         let Data = {
//             pembayaran, 
//         }
//         await Model_Pembayaran.Store(Data);
//         req.flash('success', 'Berhasil Menyimpan Data!');
//         res.redirect("/pembayaran");
//     } catch(error) {
//         console.log(error);
//         req.flash('error', "Terjadi kesalahan pada Menyimpan Data!");
//         res.redirect("/pembayaran");
//     }
// });


router.get("/edit/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        let rows = await Model_Pembayaran.getId(id);
        let rows2 = await Model_Menu.getAll();
        let rows3 = await Model_Users.getAll();
        if (rows.length > 0) {
            res.render("pembayaran/edit", {
                id: id,
                data: rows[0],
                data_menu: rows2,
                data_users: rows3,
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post("/update/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        let {status_pemesanan, jumlah, id_menu, id_users} = req.body;

        let Data = {
            status_pemesanan,
            jumlah,
            id_menu,
            id_users,
        }
        console.log(req.body);
        console.log(Data);
        await Model_Pembayaran.Update(id, Data);
        req.flash("success", "Berhasil mengupdate data pembayaran");
        res.redirect("/pembayaran");
    } catch (error) {
        console.log(error);
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await Model_Pembayaran.Delete(id);
        req.flash('success', 'Berhasil menghapus data pembayaran');
        res.redirect('/catering/keranjang');
    } catch (error) {
        req.flash("error", "Gagal menghapus data pembayaran");
        res.redirect("/catering/keranjang");
        console.log(error)
    }
});

// router.get('/users', async function (req, res, next) {
//     try {
//         // let level_users = req.session.level;
//         let id = req.session.userId;
//         let rows = await Model_Dokter.getAll();
//         res.render('dokter/users/index', {
//         })
//     } catch (error) {
//         console.error("Error:", error);
//         req.flash('invalid', 'Terjadi kesalahan saat memuat data pengguna');
//         res.redirect('/login');
//     }
// });


module.exports = router;