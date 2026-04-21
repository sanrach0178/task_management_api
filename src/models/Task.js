const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const taskSchema = new mongoose.Schema(
    {
        _id: Number,
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
            default: '',
        },
        dueDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'completed'],
                message: 'Status must be either pending or completed',
            },
            default: 'pending',
        },
        userId: {
            type: Number,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
        _id: false,
    }
);

taskSchema.pre('save', async function () {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            'task_id_seq',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
    }
});

taskSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

module.exports = mongoose.model('Task', taskSchema);
