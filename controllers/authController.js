const Staff = require('../models/staffModel');
const bcrypt = require('bcryptjs');  // استيراد مكتبة bcrypt
const createToken = require('./../utils/create.token');
exports.log_in = async (request, response, next) => {
    console.log(request.body);

    const { email, password } = request.body;

    if (!email || !password)
        return response.status(400).send("Un-authenticated");

    const staff = await Staff.findOne({ email }).select('+password'); // تأكد من أنك تسترجع كلمة السر

    if (!staff) {
        return response.status(400).send("Staff not found");
    }

    // تحقق من كلمة السر باستخدام bcrypt
    const isPasswordCorrect = await bcrypt.compare(password, staff.password);

    if (!isPasswordCorrect) {
        return response.status(400).send("Invalid credentials");
    }

    // إذا كانت كلمة السر صحيحة، قم بإنشاء التوكن
    await createToken(staff, 200, response);
};
