import Address from "../models/Address.js"


// Them dia chi : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const addressData = req.body; // toàn bộ thông tin trong body

        await Address.create(addressData);

        res.json({ success: true, message: "Thêm địa chỉ thành công" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


//Get Address : /api/address/get
export const getAddress = async(req, res ) => {
    try {
        const userId = req.query.userId; // ✅ lấy từ query

        if (!userId) {
            return res.json({ success: false, message: "userId is required" });
        }

        const addresses = await Address.find({ userId });
        res.json({ success: true, addresses });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
