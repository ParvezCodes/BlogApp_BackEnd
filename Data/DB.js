import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "BlogApp" })
    .then((c) => {
      console.log(`DB Connected with ${c.connection.host}`);
    })
    .catch((e) => {
      console.log(e);
    });
};
