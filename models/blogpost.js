const mongoose = require("mongoose")

const blogpostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        }
     ],
    thumbnail: String,
    date: { type: Date, default: Date.now },
    order: Number,
    description: String,
    category: String,
    tags: Array,
    content: String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
})

module.exports = mongoose.model("Blogpost", blogpostSchema);