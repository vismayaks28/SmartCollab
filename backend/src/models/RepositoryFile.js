const mongoose = require("mongoose");

const repositoryFileSchema = new mongoose.Schema(
    {
        repository: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository",
            required: true
        },

        path: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            default: ""
        },

        type: {
            type: String,
            enum: ["file", "directory"],
            default: "file"
        }
    },
    {
        timestamps: true
    }
);

repositoryFileSchema.index(
    { repository: 1, path: 1 },
    { unique: true }
);

module.exports = mongoose.model("RepositoryFile", repositoryFileSchema);