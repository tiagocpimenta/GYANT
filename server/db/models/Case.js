import mongoose from 'mongoose';

const CaseSchema = mongoose.Schema({
    id: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        conditionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Condition',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
});

const Case = mongoose.model('Case', CaseSchema);

export default Case;
