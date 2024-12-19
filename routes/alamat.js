const express = require("express");
const router = express.Router();
const Model_Alamat = require('../model/Model_Alamat.js');
const Model_Users = require('../model/Model_Users.js');




// router.get('/', async (req, res, next) => {
//     try {
//         let id = req.session.userId;
//         let Data = await Model_Users.getId(id);
//         let rows = await Model_Keahlian.getAll();
//         res.render('keahlian/index', {
//             data: rows,
//             data2: Data,
//         });
//     } catch (error) {
//         next(error);
//     }
// });

// router.get('/create', async function (req, res, next) {
//     try {
//         let level_users = req.session.level;
//         let id = req.session.userId;
//         let Data = await Model_Alamat.getAll();
//         // if(Data[0].level_users == "2") {
//         res.render('keahlian/create', {
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

router.post('/store', async function (req, res, next) {
    try {
        let id_users = req.session.userId;
        let { pengantaran, nama_alamat, no_telp_penerima, nama_penerima} = req.body;
        
        let Data = {
            pengantaran, nama_alamat, no_telp_penerima, nama_penerima, id_users, 
        }
        await Model_Alamat.Store(Data);
        req.flash('success', 'Berhasil Menyimpan Data!');
        res.redirect("/catering/alamat");
    } catch(error) {
        console.log(error);
        req.flash('error', "Terjadi kesalahan pada Menyimpan Data!");
        res.redirect("/catering/alamat");
    }
});



// router.get("/edit/:id", async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         let rows = await Model_Keahlian.getId(id);
//         let rows2 = await Model_Keahlian.getAll();
//         if (rows.length > 0) {
//             res.render("keahlian/edit", {
//                 id: id,
//                 data: rows[0],
//                 data_keahlian: rows2,
//             });
//         } else {
//             req.flash("error", "keahlian not found");
//             res.redirect("/keahlian");
//         }
//     } catch (error) {
//         next(error);
//     }
// });

router.post("/update", async (req, res, next) => {
    
    try {
        const id = req.params.id;

        let {
            id_alamat,
            nama_alamat,
            no_telp_penerima,
            nama_penerima,
        } = req.body;

        let Data = {
            nama_alamat,
            no_telp_penerima,
            nama_penerima,
        }
        console.log(req.body);
        console.log(Data);
        await Model_Alamat.Update(id_alamat, Data);
        req.flash("success", "Berhasil mengupdate data Alamat");
        res.redirect("/catering/alamat");
    } catch (error) {
        console.log(error);
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await Model_Alamat.Delete(id);
        req.flash('success', 'Berhasil menghapus data keahlian');
        res.redirect('/catering/alamat');
    } catch (error) {
        req.flash("error", "Gagal menghapus data keahlian");
        res.redirect("/catering/alamat");
    }
});

module.exports = router;