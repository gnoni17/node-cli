import supertest from "supertest";
import { app } from "../..";
import { statusCodes } from "../../utils/response";

const api = supertest(app);

let token = "";
let csrfToken = "";

const user = {
  email: "test@gmail.com",
  password: "test123RT5",
};

describe("test user controller", () => {
  it("test signup", async () => {
    // validate test
    const failResponse = await api.post("/signup").send({ ...user, email: "test" });
    expect(failResponse.status).toEqual(statusCodes.BadRequest);

    // test
    const response = await api.post("/signup").send(user);

    const cookie = response.headers["set-cookie"][0];
    token = cookie.slice(0, cookie.indexOf(";"));

    csrfToken = response.body.data.token;

    expect(response.status).toEqual(statusCodes.Ok);

    // user already exist test
    const alreadyExistResponse = await api.post("/signup").send(user);
    expect(alreadyExistResponse.status).toEqual(statusCodes.BadRequest);
  });

  it("test signin", async () => {
    // user not found
    const failResponse = await api.post("/signin").send({
      email: "usernotfound@gmail.com",
      password: "test26r34g348",
    });
    expect(failResponse.status).toEqual(statusCodes.NotFound);

    // password is not correct
    const responseErrorPassword = await api.post("/signin").send({ ...user, password: "not correct" });
    expect(responseErrorPassword.status).toEqual(statusCodes.BadRequest);

    // test
    const responseDone = await api.post("/signin").send(user);
    expect(responseDone.status).toEqual(statusCodes.Ok);

    const cookie = responseDone.headers["set-cookie"][0];
    token = cookie.slice(0, cookie.indexOf(";"));

    csrfToken = responseDone.body.data.token;
  });

  it("test put user", async () => {
    const responseDone = await api.put("/user").send(user).set("Cookie", token).set("csrf", csrfToken);
    expect(responseDone.status).toEqual(statusCodes.Ok);
  });

  it("test delete user", async () => {
    const responseDone = await api.delete("/user").set("Cookie", token).set("csrf", csrfToken);
    expect(responseDone.status).toEqual(statusCodes.Ok);
  });
});
