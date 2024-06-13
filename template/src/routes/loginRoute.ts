import { Router } from "express";

const loginRoute = Router();

loginRoute.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }

  res.render("index");
});

loginRoute.get("/signup", (req, res) => {
  res.render("signup", { error: undefined });
});

loginRoute.get("/signin", (req, res) => {
  res.render("signin", { error: undefined });
});

export { loginRoute };
