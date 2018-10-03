"use strict";
const async = require("async");

import {BaseModel} from './BaseModel';


/**
 *  Contact Model for storing and retrieving contacts from/to database
 */
export default class ContactModel extends BaseModel {


    /**
     * Retrieve contact(s) from database
     * @param contact contact reference, only id used by now
     * @param callback method return result to the caller
     */
    get(contact, callback) {
        let db = null;
        let params = [];
        let query = "SELECT * FROM tb_contact";
        if (contact.id) {
            query += " WHERE id = ? LIMIT 1";
            params.push(contact.id);
        }
        async.waterfall(
            [
                function getConn(callback){
                    global.databasePool.getConnection(function (err, conn){
                        db = conn;
                        callback();
                    });
                },
                function (callback){
                    db.query(query, params, (err, result) => {
                        if (err) {
                            callback(err, result);
                        } else {
                            callback(null, result);
                        }
                        db.release();
                    })
                }
            ], function (err, result){
                callback(err, result);
            });
    }

    /**
     * Add contact to database
     * @param contact to be inserted
     * @param callback method return result to the caller
     */
    add(contact, callback) {
        let db = null;
        async.waterfall(
            [
                function getConn(callback){
                    global.databasePool.getConnection(function (err, conn){
                        db = conn;
                        callback();
                    });
                },
                function checkIfExists(callback) {
                    db.query("SELECT * FROM tb_contact WHERE email = ?", [contact.email], (err, result) => {
                        if (err) {
                            callback(err);
                        } else if (result.length > 0) {
                            callback(new Error("Contact already exists"));
                        } else {
                            callback();
                        }
                    });
                },
                // if do not exists insert
                function insertContact(callback){
                    db.query("INSERT INTO tb_contact (email,phone) VALUES (?,?)", [contact.email, contact.phone], (err, result) => {
                        if (err) {
                            callback(err);
                        } else {
                            callback();
                        }
                    });
                },
                // get generated id
                function getLastId(callback){
                    db.query("select LAST_INSERT_ID() as last_id", (err, result) => {
                        if (err) {
                            callback(err);
                        } else {
                            contact.id = result[0].last_id;
                            callback(null, contact);
                        }
                    });
                }
            ],
            // return result to the caller
            function (err, result) {
                callback(err, result);
                db.release();
            }
        );
    }

    /**
     *  Update existing contact
     * @param contact to be updated
     * @param callback method return result to the caller
     */
    update(contact, callback) {
        let db = null;
        async.waterfall(
            [
                function getConn(callback){
                    global.databasePool.getConnection(function (err, conn){
                        db = conn;
                        callback();
                    });
                },
                // check if contact exists on database
                function getUser(callback){
                    db.query("SELECT * FROM tb_contact WHERE id = ?", [contact.id], (err, result) => {
                        if (err) {
                            callback(err);
                        } else if (result.length === 0) {
                            callback(new Error("Contact not found."));
                        } else {
                            callback(err, result);
                        }
                    });
                },
                // update the contact
                function updateUser(user, callback){
                    db.query("update tb_contact set email=?, phone=? where id=?", [contact.email, contact.phone, contact.id], (err, result) => {
                        callback(err, result);
                    });
                },
            ],
            // return result to the caller
            function (err, result) {
                callback(err, result);
                db.release();
            }
        );
    }

    /**
     * Delete contact from database
     * @param contact to be deleted
     * @param callback method return result to the caller
     */
    delete(contact, callback) {
        let db = null;
        async.waterfall(
            [
                function getConn(callback){
                    global.databasePool.getConnection(function (err, conn){
                        db = conn;
                        callback();
                    });
                },
                // check if user exists
                function getUser(callback){
                    db.query("SELECT * FROM tb_contact WHERE id = ?", [contact.id], (err, result) => {
                        if (err) {
                            callback(err);
                        } else if (result.length === 0) {
                            callback(new Error("Contact not found."));
                        } else {
                            callback(err, result);
                        }
                    });
                },
                // delete user from database
                function deleteUser(user, callback){
                    db.query("delete from tb_contact where id=?", [contact.id], (err, result) => {
                        callback(err, result);
                    });
                },
            ],
            // return result to the caller
            function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback();
                }
                db.release();
            }
        );
    }


}
