import mongoose from "mongoose";

async function testConnection() {
  const uri = "mongodb+srv://kulamharis786_db_user:lNwCIvvWR6vAci5b@cluster0.tlevxqt.mongodb.net/horological_vault";
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS! Connection works.");
    process.exit(0);
  } catch (err) {
    console.log("FAILED to connect:", err.message);
    process.exit(1);
  }
}
testConnection();