const connection = require('../config/database');

class Model_Menu {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`select a.*, b.nama_kategori from menu as a
                join kategori_menu as b on a.id_kategori=b.id_kategori
                order by id_menu DESC`, (err, rows) => {
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
            connection.query('insert into menu set ?', Data, function (err, result) {
                if (err) {
                    reject(err);
                    console.log(Data)
                    console.log(err)
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query(`select a.*, b.nama_kategori from menu as a
                join kategori_menu as b on a.id_kategori=b.id_kategori
                where a.id_menu= ` + id, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(rows);
                    resolve(rows);
                }
            })
        })
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('update menu set ? where id_menu =' + id, Data, function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                    console.log(Data);
                }
            })
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('delete from menu where id_menu =' + id, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }




}


module.exports = Model_Menu;