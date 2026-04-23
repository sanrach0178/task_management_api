const Task = require('../models/Task');
const { scheduleReminder, removeReminder, triggerCompletionWebhook } = require('../services/queue.service');

const createTask = async (req, res, next) => {
    try {
        const { title, description, dueDate, status, categoryId, tags } = req.body;

        const task = await Task.create({
            title,
            description,
            dueDate,
            status,
            categoryId,
            tags,
            userId: req.user.id,
        });

        await scheduleReminder(task);

        if (task.status === 'completed') {
            await triggerCompletionWebhook(task);
        }

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
        const { status, categoryId, tags, page = 1, limit = 10 } = req.query;

        const filter = { userId: req.user.id };
        if (status) {
            filter.status = status;
        }
        if (categoryId) {
            filter.categoryId = parseInt(categoryId, 10);
        }
        if (tags) {
            const tagIds = String(tags).split(',').map(tag => parseInt(tag, 10));
            filter.tags = { $all: tagIds };
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

        if (!task || task.userId !== req.user.id) {
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

        if (!task || task.userId !== req.user.id) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
        }

        const allowedFields = ['title', 'description', 'dueDate', 'status', 'categoryId', 'tags'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                task[field] = req.body[field];
            }
        });

        await task.save();

        if (task.status === 'completed') {
            await triggerCompletionWebhook(task);
            await removeReminder(task.id);
        } else {
            await scheduleReminder(task);
        }

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

        if (!task || task.userId !== req.user.id) {
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
