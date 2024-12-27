const express = require("express");
const router = express.Router();
const Model_Pembayaran = require('../Model/Model_Pembayaran.js');
const Model_Menu = require("../Model/Model_Menu.js");
const Model_Users = require("../Model/Model_Users.js");

router.get('/', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Pembayaran.getPesananAdmin(id);
        let rows2 = await Model_Pembayaran.getMenu(id);
        let rows3 = await Model_Users.getId(id)
        res.render('pembayaran/index', {
            id: id,
            data: rows, 
            data2: rows3,
            data3: rows2
        });
    } catch (error) {
        res.redirect('/login');
        console.log(error);
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


router.get("/detail/:id_users/:id_checkout", async (req, res, next) => {
    try {
        let id = req.session.userId;
        const id_users = req.params.id_users;
        const id_checkout = req.params.id_checkout;
        console.log('id_users:', id_users, 'id_checkout:', id_checkout);  // Log untuk memastikan parameter yang diterima
        let rows = await Model_Pembayaran.getDetailMenu(id_checkout, id_users);
        let rows2 = await Model_Users.getId(id);
        if (rows.length > 0) {
            res.render("pembayaran/detail", {
                id: id,
                data: rows,
                data2: rows2,
            });
        } else {
            res.status(404).send('Detail not found');
        }
    } catch (error) {
        console.error('Error in /detail/:id_users/:id_checkout route:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.post("/update/:id_users/:id_checkout", async (req, res, next) => {
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

router.post('/update/(:id)', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { status_pemesanan } = req.body;
        let Data = {
            status_pemesanan
        }
        await Model_Pembayaran.Update(id, Data);
        console.log(Data);
        req.flash('success', 'Berhasil mengubah data');
        res.redirect('/pembayaran')
    } catch(error) {
        req.flash('error', 'terjadi kesalahan pada fungsi', error);
        res.redirect('/pembayaran');
    }
})


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

router.get('/riwayat', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Pembayaran.getRiwayatAdmin(id);
        let rows2 = await Model_Pembayaran.getMenu(id);
        let rows3 = await Model_Users.getId(id)
        res.render('riwayat/index', {
            id: id,
            data: rows, 
            data2: rows3,
            data3: rows2
        });
    } catch (error) {
        res.redirect('/login');
        console.log(error);
    }
});


module.exports = router;