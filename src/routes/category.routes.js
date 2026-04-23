const express = require('express');
const router = express.Router();

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require('../controllers/category.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { categorySchema } = require('../validators/category.validator');

router.use(authenticate);
router.post('/', validate(categorySchema), createCategory);


router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

router.patch('/:id', validate(categorySchema), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
