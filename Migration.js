const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Course = require('./models/courseModel'); // تأكد من المسار الصحيح حسب مشروعك

// تحميل ملف البيئة
dotenv.config({ path: path.join(__dirname, './config.env') });

// الاتصال بقاعدة البيانات
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

async function migrateDepartments() {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const result = await Course.updateMany(
      { department: { $type: 'objectId' } }, // لو department لسه قيمة واحدة
      [{ $set: { department: ["$department"] } }] // نحولها لمصفوفة
    );

    console.log(`✅ Migration complete: ${result.modifiedCount} course(s) updated.`);
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrateDepartments();
