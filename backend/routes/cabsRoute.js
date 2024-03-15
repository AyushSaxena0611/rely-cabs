import express from 'express';
import {getCabs,getCabById} from '../controllers/cabController.js'
const router = express.Router();

router.get('/',getCabs);
router.get('/:id',getCabById);


export default router;