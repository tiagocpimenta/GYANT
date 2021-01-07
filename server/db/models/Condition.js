import mongoose from 'mongoose';

const ConditionSchema = mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const Condition = mongoose.model('Condition', ConditionSchema);

export default Condition;
