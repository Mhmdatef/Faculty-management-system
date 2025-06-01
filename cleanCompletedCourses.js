const mongoose = require('mongoose');

require('dotenv').config({ path: './Faculty management system/.env' });

const DB = process.env.NODE_ENV === 'production' 
  ? process.env.DATABASE 
  : process.env.DATABASE_LOCAL;

async function clearDatabase() {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB');

    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }

    console.log('All collections cleared');
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

clearDatabase();
