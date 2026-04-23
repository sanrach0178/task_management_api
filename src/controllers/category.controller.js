const Category = require('../models/Category');

exports.createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const category = await Category.create({ name, userId });

        res.status(201).json({
            success: true,
            message: 'Category created successfully.',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const categories = await Category.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const userId = req.user.id;

        const category = await Category.findOne({ _id: categoryId, userId });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.',
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const userId = req.user.id;
        const { name } = req.body;

        const category = await Category.findOneAndUpdate(
            { _id: categoryId, userId },
            { name },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const userId = req.user.id;

        const category = await Category.findOneAndDelete({ _id: categoryId, userId });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully.',
        });
    } catch (error) {
        next(error);
    }
};
