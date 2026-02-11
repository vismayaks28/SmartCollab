const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    action: {
        type: String,
        required: true
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    resourceType: {
        type: String,
        default: null
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model("Activity", activitySchema);
