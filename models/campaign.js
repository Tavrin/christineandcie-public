const mongoose = require("mongoose")

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    creationDate: { type: Date, default: Date.now },
    description: String,
    category: String,
    sender: String,
    sendTo: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Contact"
        }
     ],
     templates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Template"
         }
     ]
})

module.exports = mongoose.model("Campaign", campaignSchema);