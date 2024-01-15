const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = require("./app");
const port = process.env.PORT || 3000;

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT EXCEPTION.... Shutting Down");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

// Connect to database
(async function () {
  try {
    await mongoose.connect(
      "mongodb+srv://mikeanthony595:XjF2RsqwFErtqutZ@g-up.3dxfsmr.mongodb.net/g-up?retryWrites=true&w=majority"
    );
  } finally {
    console.log("Successfully connected to Database!");
  }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
})();

// Start server
const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION.... Shutting Down");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECIEVED SHutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});
