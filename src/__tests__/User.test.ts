import req from 'supertest';
import { app } from '../app';

import createConnection from '../database';

describe("Users", async () => {

  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it("Should be able to create a new user", async () => {
    const response = await req(app).post("/users").send({
      email: "johndoe@example.com",
      name: "John Doe"
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a new user", async () => {
    const response = await req(app).post("/users").send({
      email: "johndoe@example.com",
      name: "John Doe"
    });

    expect(response.status).toBe(400);
  });

})