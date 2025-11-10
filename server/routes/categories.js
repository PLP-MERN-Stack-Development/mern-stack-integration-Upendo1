// Task 2
import express from 'express';
import * as catCtrl from '../controllers/categoryController.js';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
const router = express.Router();
router.get('/', catCtrl.getCategories);
router.post('/', [body('name').notEmpty()], validate, catCtrl.createCategory);
export default router;
