const connection = require('../config/database');

class Model_Alamat {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT a.*, u.nama_users, u.nama_panggilan_users, u.no_telp_users 
                FROM alamat AS a
                left JOIN userskantin AS u ON a.id_users = u.id_users
                ORDER BY id_alamat DESC`, (err, rows) => {
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
            connection.query('INSERT INTO alamat SET ?', Data, function (err, result) {
                if (err) {
                    reject(err);
                    console.log(Data);
                    console.log(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT a.*, u.nama_users, u.nama_panggilan_users, u.no_telp_users 
                FROM alamat AS a
                left JOIN userskantin AS u ON a.id_users = u.id_users
                WHERE a.id_users = ` + id, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(rows);
                    resolve(rows);
                }
            });
        });
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE alamat SET ? WHERE id_alamat = ' + id, Data, function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                    console.log(Data);
                }
            });
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM alamat WHERE id_alamat = ' + id, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

}

module.exports = Model_Alamat;
