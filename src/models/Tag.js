const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const tagSchema = new mongoose.Schema(
    {
        _id: Number,
        name: {
            type: String,
            required: [true, 'Tag name is required'],
            trim: true,
            maxlength: [100, 'Tag name cannot exceed 100 characters'],
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

tagSchema.pre('save', async function () {
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            'tag_id_seq',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this._id = counter.seq;
    }
});

tagSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

module.exports = mongoose.model('Tag', tagSchema);
