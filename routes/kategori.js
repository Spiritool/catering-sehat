const express = require("express");
const router = express.Router();
const Model_Kategori = require('../Model/Model_Kategori.js');
const Model_Users = require('../Model/Model_Users.js');




router.get('/', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let Data = await Model_Users.getId(id);
        let rows = await Model_Kategori.getAll();
        res.render('kategori/index', {
            data: rows,
            data2: Data,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/create', async function (req, res, next) {
    try {
        let level_users = req.session.level;
        let id = req.session.userId;
        let Data = await Model_Kategori.getAll();
        // if(Data[0].level_users == "2") {
        res.render('kategori/create', {
            nama_service: '',
            data: Data,
        })
        // }
        // else if (Data[0].level_users == "1"){
        //     req.flash('failure', 'Anda bukan admin');
        //     res.redirect('/sevice')
        // }
    } catch (error) {
        console.log(error);
    }
})

router.post('/store', async function (req, res, next) {
    try {
        let { nama_kategori } = req.body;
        
        let Data = {
            nama_kategori, 
        }
        await Model_Kategori.Store(Data);
        req.flash('success', 'Berhasil Menyimpan Data!');
        res.redirect("/kategori");
    } catch(error) {
        console.log(error);
        req.flash('error', "Terjadi kesalahan pada Menyimpan Data!");
        res.redirect("/kategori");
    }
});



router.get("/edit/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        let rows = await Model_Kategori.getId(id);
        if (rows.length > 0) {
            res.render("kategori/edit", {
                id: id,
                data: rows[0],
            });
        } else {
            req.flash("error", "kategori not found");
            res.redirect("/kategori");
        }
    } catch (error) {
        next(error);
    }
});

router.post("/update/:id", async (req, res, next) => {
    try {
        const id = req.params.id;

        let {
            nama_kategori
        } = req.body;

        let Data = {
            nama_kategori
        }
        console.log(req.body);
        console.log(Data);
        await Model_Kategori.Update(id, Data);
        req.flash("success", "Berhasil mengupdate data dokter");
        res.redirect("/kategori");
    } catch (error) {
        console.log(error);
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await Model_Kategori.Delete(id);
        req.flash('success', 'Berhasil menghapus data kategori');
        res.redirect('/kategori');
    } catch (error) {
        req.flash("error", "Gagal menghapus data kategori");
        res.redirect("/kategori");
    }
});

module.exports = router;