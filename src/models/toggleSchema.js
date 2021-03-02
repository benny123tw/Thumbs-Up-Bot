const mongoose = require('mongoose');

const toggleSchema = new mongoose.Schema({
    serverID: { type: String, require: true },
    serverName: { type: String, require: true },
    prefix: { type: String, require: true },
    emoji: { type: String, default: '👍'},
    thumbsUp: { type: Boolean, default: false },
    lonely: { type: Boolean, default: false },
});

const model = mongoose.model('ToggleModels', toggleSchema);

module.exports = model;
