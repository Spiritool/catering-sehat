const connection = require('../config/database');

class Model_Pembayaran {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT pembayaran.*, menu.nama_menu, users.nama_users
                FROM pembayaran
                JOIN menu ON pembayaran.id_menu = menu.id_menu
                JOIN users ON pembayaran.id_users = users.id_users
                ORDER BY id_pembayaran DESC
            `, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async Store(Data) {
        return new Promise((resolve, reject) => {
            connection.query('insert into pembayaran set ?', Data, function (err, result) {
                if (err) {
                    reject(err);
                    console.log(result)
                    console.log(err)
                } else {
                    resolve(result);
                    console.log(result)

                }
            })
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT pembayaran.*, menu.nama_menu, users.nama_users
                FROM pembayaran
                JOIN menu ON pembayaran.id_menu = menu.id_menu
                JOIN users ON pembayaran.id_users = users.id_users
                WHERE pembayaran.id_pembayaran = ?
            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('update checkout set ? where id_checkout =' + id, Data, function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                    console.log(result);
                }
            })
        });
    }

    static async Batal(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('update checkout set ? where id_checkout =' + id, Data, function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                    console.log(result);
                }
            })
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('delete from pembayaran where id_pembayaran =' + id, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async getKeranjang(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT pembayaran.*, menu.gambar_menu, menu.nama_menu, menu.harga_menu, users.nama_users
                FROM pembayaran
                left JOIN menu ON pembayaran.id_menu = menu.id_menu
                left JOIN users ON pembayaran.id_users = users.id_users
                WHERE pembayaran.id_users = ? AND id_checkout is null AND id_Alamat is null
            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async getPesanan(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT a.id_checkout, a.*   
                FROM checkout AS a
                LEFT JOIN pembayaran AS b ON b.id_checkout = a.id_checkout
                WHERE b.id_users=? AND a.status_pemesanan!='selesai' AND a.status_pemesanan!='batal' 
                GROUP BY a.id_checkout
            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async getMenu(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT a.*, b.*, c.*
                FROM checkout AS a
                LEFT JOIN pembayaran AS b ON b.id_checkout = a.id_checkout
                left Join menu as c on c.id_menu = b.id_menu
                WHERE b.id_users=?
            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async getRiwayat(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT a.id_checkout, a.*   
FROM checkout AS a
LEFT JOIN pembayaran AS b ON b.id_checkout = a.id_checkout
WHERE b.id_users=? AND (status_pemesanan='selesai' OR status_pemesanan='batal')
GROUP BY a.id_checkout 
ORDER BY status_pemesanan ASC;

            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async getDetailRiwayat(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT a.*, b.*, c.*
                FROM checkout AS a
                LEFT JOIN pembayaran AS b ON b.id_checkout = a.id_checkout
                left Join menu as c on c.id_menu = b.id_menu
                WHERE b.id_users=?
            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async getPesananAdmin(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT 
                    a.id_checkout, 
                    a.*, 
                    MAX(b.id_users) AS id_users, 
                    MAX(d.nama_alamat) AS nama_alamat, 
                    MAX(c.nama_users) AS nama_users,
                    (SELECT SUM(b.jumlah) 
                    FROM pembayaran AS b 
                    WHERE b.id_checkout = a.id_checkout) AS total_pesanan
                FROM checkout AS a
                LEFT JOIN pembayaran AS b ON b.id_checkout = a.id_checkout
                LEFT JOIN userskantin AS c ON c.id_users = b.id_users
                LEFT JOIN alamat as d on d.id_alamat = b.id_alamat
                WHERE a.status_pemesanan != 'selesai' AND a.status_pemesanan != 'batal'
                GROUP BY a.id_checkout;
            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async getDetailMenu(id_checkout, id_users) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT a.*, b.*, c.*
                FROM checkout AS a
                LEFT JOIN pembayaran AS b ON b.id_checkout = a.id_checkout
                LEFT JOIN menu AS c ON c.id_menu = b.id_menu
                WHERE b.id_users = ? AND a.id_checkout = ?
            `, [id_users, id_checkout], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async getRiwayatAdmin(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT 
                    a.id_checkout, 
                    a.*, 
                    MAX(b.id_users) AS id_users, 
                    MAX(d.nama_alamat) AS nama_alamat, 
                    MAX(c.nama_users) AS nama_users,
                    (SELECT SUM(b.jumlah) 
                    FROM pembayaran AS b 
                    WHERE b.id_checkout = a.id_checkout) AS total_pesanan
                FROM checkout AS a
                LEFT JOIN pembayaran AS b ON b.id_checkout = a.id_checkout
                LEFT JOIN userskantin AS c ON c.id_users = b.id_users
                LEFT JOIN alamat as d on d.id_alamat = b.id_alamat
                WHERE a.status_pemesanan != 'dimasak' AND a.status_pemesanan != 'diantar'
                GROUP BY a.id_checkout;
            `, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }
    

}


module.exports = Model_Pembayaran;