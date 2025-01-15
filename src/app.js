// import express from "express";
// import cors from "cors";
// import globalErrorHandler from "./app/middlewares/globalErrorhandler.js";
// import notFound from "./app/middlewares/notFound.js";
// import router from "./app/routes/index.js";
// import cookieParser from "cookie-parser";
// const app = express();

// // parser
// app.use(express.json());
// // app.use(cors({ origin: 'https://www.immogroup.ro', credentials: true }));
// // app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(
//   cors({
//     origin: [
//       "https://real-estate-frontend-lime-ten.vercel.app",
//       "http://localhost:5173",
//     ],
//     credentials: true,
//   })
// );
// app.use(cookieParser());

// // application routes
// app.use("/api/v1", router);

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "server is running",
//   });
// });

// // wrong rout error handler
// app.all("*", notFound);

// // global error handler
// app.use(globalErrorHandler);

// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

// export default app;

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import globalErrorHandler from "./app/middlewares/globalErrorhandler.js";
import notFound from "./app/middlewares/notFound.js";
import router from "./app/routes/index.js";

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));

app.use(
  cors({
    origin: [
      "https://real-estate-frontend-tau.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(cookieParser(process.env.COOKIE_SECRET));

// Application routes
app.use("/api/v1", router);

app.get("/", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Server is running",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
});

// Not Found handler
app.all("*", notFound);

// Global Error handler
app.use(globalErrorHandler);

export default app;
