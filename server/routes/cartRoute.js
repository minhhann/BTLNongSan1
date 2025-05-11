import express from 'express'; // Thêm dòng này
import authUser from '../middlewares/authUser.js';
import { updateCart } from '../controllers/cartController.js';

const cartRouter = express.Router(); // ✅ Sử dụng express.Router()

cartRouter.post('/update', authUser, updateCart);

export default cartRouter;
