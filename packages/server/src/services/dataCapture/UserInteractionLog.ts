import mongoose from 'mongoose';

const UserInteractionLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: {
        type: String,
        enum: [
            'CONTENT_GENERATION',
            'FEATURE_USAGE',
            'SEARCH_QUERY',
            'FAQ_QUESTION',
            'FAITH_MODE_EVENT',
            'UPLOAD_METADATA',
        ],
        required: true,
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('UserInteractionLog', UserInteractionLogSchema); 