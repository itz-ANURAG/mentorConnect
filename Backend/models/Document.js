const mongoose = require('mongoose');

// Document/Link (shared during sessions or video calls):
// Fields: document_id, file_name, file_type, url, chat_id, session_id.


const documentSchema = new mongoose.Schema({
    file_name: { type: String, required: true },
    file_type: { type: String, required: true },
    url: { type: String, required: true },
    chat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
});

module.exports = mongoose.model('Document', documentSchema);
