const express = require('express');
const router = express.Router();

const {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag,
} = require('../controllers/tag.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { tagSchema } = require('../validators/tag.validator');

router.use(authenticate);

router.post('/', validate(tagSchema), createTag);
router.get('/', getAllTags);
router.get('/:id', getTagById);
router.patch('/:id', validate(tagSchema), updateTag);
router.delete('/:id', deleteTag);

module.exports = router;
