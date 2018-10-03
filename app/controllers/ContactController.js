"use strict";

// utility module for data manipulation
const _ = require("underscore");

// base controller
import {BaseController} from './BaseController';

// contact model
import ContactModel from "../models/ContactModel";

/**
 * Controller to receive requests of contact RESTful API
 */
export class ContactController extends BaseController {

    /**
     * Return a list of contacts or a contact if an id is provided
     * @param req httprequest reference
     * @param res httpresponse reference
     */
    static getContact(req, res) {
        const contactModel = new ContactModel();
        let contact = {"id": req.params.id};
        let data = {};

        // check for valid id parameter
        if (!_.isEmpty(contact.id) && !_.isFinite(contact.id)) {
            data.error = "invalid id parameter";
            return res.status(400).send(data);
        } else {
            contactModel.get(contact, function (err, result) {
                if (err) {
                    data.error = err.message;
                    return res.status(400).send(data);
                } else if (result.length == 0) {
                    data.message = "contacts not found";
                    return res.status(404).send(data);
                } else {
                    data.contacts = result;
                    return res.status(200).send(data);
                }
            });
        }
    }

    /**
     * Add a contact if its email does not exists on database
     * @param req httprequest reference
     * @param res httpresponse reference
     */
    static addContact(req, res) {
        let data = {};
        const contactModel = new ContactModel();
        let contact = {
            "email": req.body.email,
            "phone": req.body.phone
        };

        // check if a valid email
        if (_.isEmpty(contact.email) || !ContactController.validateEmail(contact.email)) {
            data.error = "invalid email parameter";
            return res.status(400).send(data);
        }

        // check if is a valid phone
        if (!_.isFinite(contact.phone)) {
            data.error = "invalid phone parameter";
            return res.status(400).send(data);
        }

        // add to database
        contactModel.add(contact, function(err, contact) {
            if (err) {
                data.error = err.message;
                return res.status(400).send(data);
            } else {
                data.contact = contact;
                data.message = "contact added";
                return res.status(200).send(data);
            }
        });
    }

    /**
     * update the information of a existing contact
     * @param req httprequest reference
     * @param res httpresponse reference
     */
    static updateContact(req, res) {
        const contactModel = new ContactModel();
        let contact = {
            "id": req.params.id,
            "email": req.body.email,
            "phone": req.body.phone
        };

        let data = {};

        // validate id
        if (! _.isFinite(contact.id)) {
            data.error = "invalid id parameter";
            return res.status(400).send(data);
        }

        // validate email
        if (_.isEmpty(contact.email) || !ContactController.validateEmail(contact.email)) {
            data.error = "invalid email parameter";
            return res.status(400).send(data);
        }

        // validate phone number
        if (! _.isFinite(contact.phone)) {
            data.error = "invalid phone parameter";
            return res.status(400).send(data);
        }

        // update contact
        contactModel.update(contact, function(err, result) {
            let data = {
                "contact": contact
            };
            if (err) {
                data.error = err.message;
                res.status(400).send(data);
            } else {
                data.message="contact updated";
                res.status(200).send(data);
            }
        });
    }

    /**
     * remove a contact from database
     * @param req httprequest reference
     * @param res httpresponse reference
     */
    static removeContact(req, res) {
        const contactModel = new ContactModel();
        let contact = {
            "id": req.params.id
        };

        // validate id
        if (!_.isFinite(contact.id)) {
            data.error = "invalid id parameter";
            return res.status(400).send(data);
        }

        // remove from database
        contactModel.delete(contact, function(err, result) {
            let data = {
                "contact" : contact
            };
            if (err) {
                data.error = err.message;
                res.status(400).send(data);
            } else {
                data.message="contact deleted";
                res.status(200).send(data);
            }
        });
    }

    /**
     * check for a valid email
     * @param email
     * @returns {boolean}
     */
    static validateEmail(email) {
        var re = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        return re.test(email);
    }
}
