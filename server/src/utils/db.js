import { connect } from 'mongoosee';

const dbconnect = async () => {
    try {
        await connect(process.env.DB_LINK)
        console.log("db connected")
    } catch (error) {
        console.log(error)
    }
}

export default dbconnect