const express = require("express");
const app = express();
const router = express.Router();
const Model_Pembayaran = require('../Model/Model_Pembayaran.js');
const Model_Menu = require("../Model/Model_Menu.js");
const Model_Alamat = require("../Model/Model_Alamat.js");
const Model_Users_Kantin = require("../model/Model_Users_Kantin.js");

const connection = require('../config/database');
app.use(express.json());

const queryPromise = (sql, values) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

router.get('/', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Menu.getAll();
        // Ambil menu terbaru (misalnya 5 menu terbaru)
        let produkTerbaru = await queryPromise('SELECT * FROM menu ORDER BY id_menu DESC LIMIT 6');
        let rows2 = await Model_Users_Kantin.getId(id);
        res.render('catering/beranda', {
            data: rows,             // Semua menu
            data2: rows2,           // Data user
            produkTerbaru: produkTerbaru // Produk terbaru
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
});


router.get('/keranjang', async (req, res, next) => {
    try {
        id = req.session.userId
        console.log("routes", id)
        let rows = await Model_Pembayaran.getKeranjang(id);
        res.render('catering/keranjang', {
            data: rows,
            id: id,
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/checkout', async (req, res) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Alamat.getId(id);

        const {
            itemIds
        } = req.body;

        if (!itemIds || itemIds.length === 0) {
            return res.status(400).send('Tidak ada item yang dipilih');
        }

        const query = `
            SELECT a.*, b.* FROM pembayaran as a
            LEFT JOIN menu as b ON a.id_menu = b.id_menu  
            WHERE id_pembayaran IN (${itemIds.join(', ')});
        `;

        connection.query(query, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error querying database');
            }

            // Menghitung subtotal di sisi server
            let subtotal = 0;
            results.forEach(item => {
                subtotal += item.harga_menu * item.jumlah;
            });

            const discountRate = 0;
            const discount = subtotal * discountRate;
            const total = subtotal - discount;

            console.log('Subtotal:', subtotal, 'Diskon:', discount, 'Total:', total);

            // Mengirim hasil subtotal dan total ke view
            res.render('catering/checkout', {
                items: results,
                data: rows,
                subtotal,
                discount,
                total
            });
        });
    } catch (error) {
        console.error('Terjadi error:', error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
});


router.get('/checkout', async (req, res) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Alamat.getId(id);

        res.render('catering/checkout', {
            items: [],
            data: rows,
            subtotal: 0,
            discount: 0,
            total: 0,
        });
    } catch (error) {
        console.error('Terjadi error:', error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
});

router.get('/profil', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Menu.getAll();
        let rows2 = await Model_Users_Kantin.getId(id);
        res.render('catering/profil', {
            id: id,
            data: rows,
            data2: rows2,
        });
    } catch (error) {
        res.redirect('/loginkantin');
        console.log(error);
    }
});
router.get('/alamat', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Alamat.getId(id);
        let rows2 = await Model_Users_Kantin.getId(id);
        res.render('catering/alamat', {
            id: id,
            data: rows,
            data2: rows2,
        });
    } catch (error) {
        res.redirect('/loginkantin');
        console.log(error);
    }
});

router.get('/pesanan', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Pembayaran.getPesanan(id);
        let rows2 = await Model_Pembayaran.getMenu(id);
        let rows3 = await Model_Users_Kantin.getId(id)
        res.render('catering/pesanan', {
            id: id,
            data: rows, 
            data2: rows2,
            data3: rows3
        });
    } catch (error) {
        res.redirect('/loginkantin');
        console.log(error);
    }
});

router.post('/batal/(:id)', async function (req, res, next) {
    try {
        let id = req.params.id;
        let Data = {
            status_pemesanan : 'batal'
        }
        await Model_Pembayaran.Batal(id, Data);
        console.log(Data);
        req.flash('success', 'Berhasil mengubah data');
        res.redirect('/catering/pesanan')
    } catch(error) {
        req.flash('error', 'terjadi kesalahan pada fungsi', error);
        res.redirect('/pembayaran');
    }
})

router.get('/riwayat', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Pembayaran.getRiwayat(id);
        let rows2 = await Model_Users_Kantin.getId(id);
        let rows3 = await Model_Pembayaran.getDetailRiwayat(id);
        res.render('catering/riwayat', {
            id: id,
            data: rows,
            data2: rows2,
            data3: rows3,
        });
    } catch (error) {
        res.redirect('/loginkantin');
        console.log(error);
    }
});


router.post('/update-quantity', async (req, res) => {
    const {
        id,
        jumlah
    } = req.body;

    try {
        // Update database sesuai kebutuhan
        const query = `UPDATE pembayaran SET jumlah = ? WHERE id_pembayaran = ?`;
        await connection.query(query, [jumlah, id]);

        res.json({
            success: true,
            message: 'Quantity updated successfully'
        });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quantity'
        });
    }
});

    router.post('/checkout/pesanan', async (req, res) => {
        const { items, total_harga, id_alamat } = req.body;

        try {
            // 1. Menginsert ke tabel checkout menggunakan Promise
            const checkoutResults = await new Promise((resolve, reject) => {
                connection.query(
                    `INSERT INTO checkout (total_harga, tanggal_checkout) VALUES (?, NOW())`,
                    [total_harga],
                    (error, results) => {
                        if (error) return reject(error);
                        resolve(results);
                    }
                );
            });

            if (checkoutResults && checkoutResults.insertId) {
                const id_checkout = checkoutResults.insertId;
                console.log('ID checkout yang dibuat:', id_checkout);

                // 2. Mengupdate tabel pembayaran berdasarkan id_pembayaran dari items
                const updatePromises = items.map(item => {
                    return new Promise((resolve, reject) => {
                        connection.query(
                            `UPDATE pembayaran SET id_checkout = ?, id_alamat = ? WHERE id_pembayaran = ?`,
                            [id_checkout, id_alamat, item.id_pembayaran],
                            (error, results) => {
                                if (error) return reject(error);
                                resolve(results);
                            }
                        );
                    });
                });

                // Tunggu semua update selesai
                await Promise.all(updatePromises);

                console.log('Pembayaran diperbarui untuk semua item');

                // Redirect ke halaman konfirmasi atau keranjang setelah proses selesai
                return res.redirect(`/catering/checkout/konfirmasi?id=${id_checkout}`);
            } else {
                throw new Error('ID Checkout tidak ditemukan setelah insert');
            }
        } catch (error) {
            console.error('Kesalahan saat checkout:', error.message);

            // Redirect ke halaman error dengan pesan kesalahan
            return res.redirect(`/catering/error?message=${encodeURIComponent(error.message)}`);
        }
    });










module.exports = router;