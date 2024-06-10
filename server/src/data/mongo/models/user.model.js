import {model, schema  } from "mongoose";
import mongoosePaginate from "mongoose-paginate"; 
const collection = "users";

const schema = new schema ({
    name: {type: String, required: true},
    last_name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true,},
    photo: {type: String, default: "link"},
    age: {type: Number, default: 18},
    //date: {type: date, default:newDate()}
},{timestamps: true})

const User = model(collection, schema)
export default users 