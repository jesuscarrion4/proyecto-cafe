import { model,Schema } from "mongoose"

const collection = "products"
const schema = new Schema({
    name: {type: String, required: true},
    poster: {type: String, required: true},
    place: {type: String, required: true},
    price: {type: Number, default: 10},
    capasity: {type: String, default: 50},
    date: {type: Date, default: newDate()}
})