const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default : "/upload/placeholder.png"
    },
    creationDate: { type: Date, default: Date.now },
    description: String,
    link: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    type: String,
    modules: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "module"
        }]
})

module.exports = mongoose.model("Category", categorySchema);