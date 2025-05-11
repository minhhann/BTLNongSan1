import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Tạo tài khoản: /api/user/register
export const register = async(req, res) => {
    try {
        const {name, email, password } = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Thông tin bị thiếu'})
        }

        const existingUser = await User.findOne({email})

        if(existingUser)
            return res.json({success: false, message: 'Người dùng đã tồn tại'})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email, password: hashedPassword})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly: true, //Ngăn JavaScript truy cập cookie
            secure: process.env.NODE_ENV === 'production', //Sử dụng cookie bảo mật trong môi trường
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //Bảo vệ chống tấn công CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, //Thời gian hết hạn
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Đăng nhập: /api/user/login
export const login = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password)
            return res.json({success: false, message: 'Email và mật khẩu là bắt buộc'});
        const user = await User.findOne({email});
        
        if(!user){
            return res.json({success: false, message: 'Email hoặc mật khẩu không hợp lệ!!'});
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch)
            return res.json({success: false, message: 'Email hoặc mật khẩu không hợp lệ!!'});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Kiểm tra quyền truy cập : /api/user/is-auth
export const isAuth = async(req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId).select("-password")
        return res.json({success: true, user})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Đăng xuất : /api/user/logout
export const logout = async(req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({success: true, message: "Đã đăng xuất"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}