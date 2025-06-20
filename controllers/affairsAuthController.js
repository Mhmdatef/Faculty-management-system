const Staff = require('../models/staffModel');
const bcrypt = require('bcryptjs');  
const { createToken } = require('../utils/create.token');

exports.log_in = async (request, response, next) => {
    console.log(request.body);

    const { email, password } = request.body;

    if (!email || !password)
        return response.status(400).send("Please provide email and password");

    const staff = await Staff.findOne({ email }).select('+password');

    if (!staff) {
        return response.status(400).send("Staff not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, staff.password);

    if (!isPasswordCorrect) {
        return response.status(400).send("Invalid credentials");
    }

    if (staff.role !== 'student_affairs') {
        return response.status(403).send("Access denied: Unauthorized staff role");
    }

    await createToken(staff, 200, response);
};
