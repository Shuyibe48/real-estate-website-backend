import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import notFound from "./src/app/middlewares/notFound.js";
import globalErrorHandler from "./src/app/middlewares/globalErrorhandler.js";
import router from "./src/app/routes/index.js";
const app = express();

// parser
app.use(express.json());
// app.use(cors({ origin: 'https://www.immogroup.ro', credentials: true }));
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(
  cors({
    origin: [
      "https://real-estate-frontend-lime-ten.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// application routes
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server is running",
  });
});

// wrong rout error handler
app.all("*", notFound);

// global error handler
app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

export default app;
