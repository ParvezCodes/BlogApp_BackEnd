import {connectDB} from "./Data/DB.js";
import {app} from "./app.js";

connectDB();

app.listen(process.env.PORT , () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
