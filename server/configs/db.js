import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.connection.on('connected', ()=> console.log("Kết nối thành công với cơ sở dữ liệu"));
        await mongoose.connect(`${process.env.MONGODB_URI}/nongsan`)
    } catch (error) {
        console.error(error.message);
    }
}

export default connectDB;