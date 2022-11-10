const { Schema , model } = require('mongoose');

const Document = model("Document", new Schema({
    _id: String,
    data: Object,
}))

const findOrCreateDocument = async(id) => {
    if(!id) return;
    const document = await Document.findById(id);
    if(document) return document;
    return await Document.create({
        _id: id,
        data: ""
    })
}

module.exports = {
    Document,
    findOrCreateDocument
}