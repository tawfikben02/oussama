const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: null,
        },
        description: {
            type: String,
            required: false,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Category", CategorySchema);
