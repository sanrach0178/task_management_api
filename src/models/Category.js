const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const categorySchema = new mongoose.Schema(
    {
        _id: Number,
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            maxlength: [100, 'Category name cannot exceed 100 characters'],
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

categorySchema.pre('save', async function () {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            'category_id_seq',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
    }
});

categorySchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

module.exports = mongoose.model('Category', categorySchema);
