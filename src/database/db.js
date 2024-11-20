import mongoose from "mongoose";

const connectDatabase = () => {
    console.log("Wait connecting to database...");
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => console.log("MongoAtlas Connected.")).catch((err) => console.log(`Error connecting to MongoDB Atlas: ${err}`));
};

export default connectDatabase;