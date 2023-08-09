const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        todo: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[A-Za-z0-9 ]+$/.test(value);
                },
                message: (props) => `${props.value} is not a valid task!`
            },
            required: [true, "Todo is required"]
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {collection: "tasks"}
);

module.exports = mongoose.model("Task", taskSchema);

