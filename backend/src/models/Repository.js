const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null
        },

        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "private"
        }
    },
    {
        timestamps: true
    }
);

repositorySchema.index({ owner: 1 });
repositorySchema.index({ project: 1 });
repositorySchema.index({ name: 1 });

module.exports = mongoose.model("Repository", repositorySchema);