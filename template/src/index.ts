import express from "express";
import session, { MemoryStore } from "express-session";
import cors from "cors";
import { config } from "dotenv";
import { userRoute } from "./routes";
import { sanitizeMiddleware } from "./middleware/escapeMiddleware";

export const app = express();
config();

app.set("views", "views");
app.set("view engine", "ejs");

app.use(cors());

app.use(
  session({
    secret: process.env.COOKIE_KEY!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      httpOnly: true,
    },
    store: new MemoryStore(),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

userRoute.get("/signup", (req, res) => {
  res.render("login");
});

app.use(sanitizeMiddleware);

app.use("/", userRoute);

app.listen("4000", () => {
  console.log("server is listen http://localhost:4000");
});
