const mongoose = require("mongoose")

const moduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default : "/upload/placeholder.png"
    },
    formation: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Formation"
        }
     ],
    creationDate: { type: Date, default: Date.now },
    description: String,
    link: {
        type: String
        // default: '/formations/' + this.formation + "/" + this._id
    },
    content: {
        type: String
    },
    video:{
        type: String
    },
    file:{
        type : String
    },
    enabled: {
        type: Boolean,
        default: true
    },
    tags: Array
})

module.exports = mongoose.model("Module", moduleSchema);