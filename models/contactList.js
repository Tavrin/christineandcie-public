const mongoose = require("mongoose")

const contactlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact"
         }
    ],
    description: String,
    creationDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Contactlist", contactlistSchema);