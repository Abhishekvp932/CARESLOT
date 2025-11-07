import express from 'express';
import { ContactController } from '../controllers/contact/contact.controller';
import { Routers } from '../utils/Routers';
import { ContactService } from '../services/contact/contact.service';
import { ContactRepository } from '../repositories/contact/contact.repository';

const router = express.Router();

const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const contactController = new ContactController(contactService);


router.route(Routers.contactRouters.create)
.post(contactController.createContactInformation.bind(contactController));

router.route(Routers.contactRouters.getContacts)
.get(contactController.getContactsData.bind(contactController));
export default router;