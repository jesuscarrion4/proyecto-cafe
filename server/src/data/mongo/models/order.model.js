import {model, schema, Types} from 'mongoose';
import users from './user.model.js';

const collection = "orders"
const schema = new Schema({
    user_id: {type: Types.ObjectId, required: true, ref: "users"},
    product_id: {type: Types.ObjectId, required: true, ref: "products"},
    quantity: {type: String,},
    state: {
        type: "string",
        enum: ["reserved", "paid", "delivered"]
    }
})