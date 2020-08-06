const mongoose = require("mongoose")

const formationSchema = new mongoose.Schema({
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
        default: "/formations/" + this._id
    },
    enabled: {
        type: Boolean,
        default: true
    },
    modules: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Module"
        }
     ],
    type: String,
    members: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        }
     ],
     categories: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Category"
        }
     ]
})

module.exports = mongoose.model("Formation", formationSchema);