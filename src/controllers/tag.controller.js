const Tag = require('../models/Tag');

exports.createTag = async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const tag = await Tag.create({ name, userId });

        res.status(201).json({
            success: true,
            message: 'Tag created successfully.',
            data: tag,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllTags = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const tags = await Tag.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tags.length,
            data: tags,
        });
    } catch (error) {
        next(error);
    }
};

exports.getTagById = async (req, res, next) => {
    try {
        const tagId = req.params.id;
        const userId = req.user.id;

        const tag = await Tag.findOne({ _id: tagId, userId });

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found.',
            });
        }

        res.status(200).json({
            success: true,
            data: tag,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateTag = async (req, res, next) => {
    try {
        const tagId = req.params.id;
        const userId = req.user.id;
        const { name } = req.body;

        const tag = await Tag.findOneAndUpdate(
            { _id: tagId, userId },
            { name },
            { new: true, runValidators: true }
        );

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tag updated successfully.',
            data: tag,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteTag = async (req, res, next) => {
    try {
        const tagId = req.params.id;
        const userId = req.user.id;

        const tag = await Tag.findOneAndDelete({ _id: tagId, userId });

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: 'Tag not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tag deleted successfully.',
        });
    } catch (error) {
        next(error);
    }
};
