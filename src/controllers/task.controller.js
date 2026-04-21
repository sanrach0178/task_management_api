const Task = require('../models/Task');

const createTask = async (req, res, next) => {
    try {
        const { title, description, dueDate, status } = req.body;

        const task = await Task.create({
            title,
            description,
            dueDate,
            status,
            userId: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully.',
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

const getAllTasks = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const filter = { userId: req.user.id };
        if (status) {
            filter.status = status;
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalTasks = await Task.countDocuments(filter);
        const totalPages = Math.ceil(totalTasks / limitNum);

        res.status(200).json({
            success: true,
            count: tasks.length,
            pagination: {
                totalTasks,
                totalPages,
                currentPage: pageNum,
                limit: limitNum
            },
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        if (task.userId !== req.user.id) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        if (task.userId !== req.user.id) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        const allowedFields = ['title', 'description', 'dueDate', 'status'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                task[field] = req.body[field];
            }
        });

        await task.save();

        res.status(200).json({
            success: true,
            message: 'Task updated successfully.',
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        if (task.userId !== req.user.id) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully.',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
