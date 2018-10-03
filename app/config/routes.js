import {ContactController} from '../controllers/ContactController';

module.exports = function (api) {
    api.post('/contact', ContactController.addContact);
    api.get('/contact/', ContactController.getContact);
    api.get('/contact/:id', ContactController.getContact);
    api.delete('/contact/:id', ContactController.removeContact);
    api.put('/contact/:id', ContactController.updateContact);
};