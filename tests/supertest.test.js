import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("test con supertest", function () {
  describe("Test de mascotas", function () {

    it("Endpoint para crear una mascota", async function () {
      const pet = {
        name: "Greta",
        specie: "Perro",
        birthDate: "12/06/2020",
      };
      const { _body } = await requester.post("/api/pets").send(pet);
      expect(_body.payload).to.have.property("_id");
      expect(_body.payload.name).to.be.equal("Greta");
    });

    it("Endpoint para crear una mascota que devuelva adopted en false", async function () {
      const pet = {
        name: "Greta",
        specie: "Perro",
        birthDate: "12/06/2020",
      };
      const { _body } = await requester.post("/api/pets").send(pet);
      expect(_body.payload.adopted).to.be.equal(false);
    });

    it("Endpoint para crear una mascota que devuelva statusCode 400 si no le paso el nombre", async function () {
      const pet = {
        specie: "Perro",
        birthDate: "12/06/2020",
      };
      const { statusCode } = await requester.post("/api/pets").send(pet);
      expect(statusCode).to.be.equal(400);
    });

    it("Endpoint get pets", async function () {
      const { _body } = await requester.get("/api/pets");
      expect(_body).to.have.property("status");
      expect(_body).to.have.property("payload");
      expect(_body.payload).to.be.an("array");
    });

    it("Endpoint para actualizar una mascota", async function () {
      const pet = {
        name: "Greta",
        specie: "Perro",
        birthDate: "12/06/2020",
      };
      const { _body: petCreatedBody } = await requester
        .post("/api/pets")
        .send(pet);
      const petUpdated = {
        name: "Greta2",
      };
      const { _body: petUpdatedBody } = await requester
        .put(`/api/pets/${petCreatedBody.payload._id}`)
        .send(petUpdated);
      expect(petUpdatedBody.payload.name).to.be.not.equals(
        petCreatedBody.payload.name
      );
    });

    it("Endpoint para eliminar una mascota", async function () {
      const pet = {
        name: "Greta",
        specie: "Perro",
        birthDate: "12/06/2020",
      };
      const { _body: petCreatedBody } = await requester
        .post("/api/pets")
        .send(pet);
      const { _body: petUpdatedBody } = await requester.delete(
        `/api/pets/${petCreatedBody.payload._id}`
      );
      const { statusCode } = await requester.get(
        `/api/pets/${petCreatedBody.payload._id}`
      );
      expect(statusCode).to.be.equal(404);
    });

        it("PUT /api/pets/:pid debe actualizar correctamente una mascota", async function () {
      const pet = {
        name: "Luna",
        specie: "Gato",
        birthDate: "01/01/2021",
      };
      const { _body: petCreated } = await requester.post("/api/pets").send(pet);

      const updatedPet = {
        name: "LunaActualizada",
      };

      const { _body: petUpdated, statusCode } = await requester
        .put(`/api/pets/${petCreated.payload._id}`)
        .send(updatedPet);

      expect(statusCode).to.equal(200);
      expect(petUpdated.status).to.equal("success");
      expect(petUpdated.payload.name).to.equal("LunaActualizada");
    });

    it("PUT /api/pets/:pid sin ID debe devolver error", async function () {
      const update = { name: "Error" };
      const { statusCode } = await requester.put("/api/pets/").send(update);
      expect([400, 404]).to.include(statusCode); // puede devolver 404 si no matchea ruta
    });

    it("DELETE /api/pets/:pid debe eliminar correctamente una mascota", async function () {
      const pet = {
        name: "Toby",
        specie: "Perro",
        birthDate: "05/05/2019",
      };
      const { _body: petCreated } = await requester.post("/api/pets").send(pet);

      const { _body: deletedResponse, statusCode } = await requester.delete(
        `/api/pets/${petCreated.payload._id}`
      );

      expect(statusCode).to.equal(200);
      expect(deletedResponse.status).to.equal("success");
      expect(deletedResponse.message).to.equal("pet deleted");

      const { statusCode: checkStatus } = await requester.get(
        `/api/pets/${petCreated.payload._id}`
      );
      expect(checkStatus).to.equal(404);
    });

    it("DELETE /api/pets/:pid con ID inválido debe devolver success igual", async function () {
      const { _body, statusCode } = await requester.delete(
        "/api/pets/000000000000000000000000"
      );
      expect(statusCode).to.equal(200);
      expect(_body.status).to.equal("success");
      expect(_body.message).to.equal("pet deleted");
    });

    it("Endpoint para crear una mascota con imagen", async function () {
      const { _body } = await requester
        .post("/api/pets/withimage")
        .field("name", "Dalma")
        .field("specie", "Gato")
        .field("birthDate", "12/09/2020")
        .attach("image", "./tests/images/cat.jpg");
      expect(_body.status).to.be.equal("success");
      expect(_body.payload.name).to.be.equal("Dalma");
    });
  });
  describe("Tests Avanzado", function () {
    const user = {
      id: "",
    };
    const cookie = {
      name: "",
      value: "",
    };
    after(async function () {
      const { _body } = await requester.delete(`/api/users/${user.id}`);
    });

    it("debe registrar un usuario correctament", async function () {
      const newUser = {
        first_name: "Mauro",
        last_name: "Luque",
        email: "mauro_luque72@gmail.com",
        password: "123456ab",
      };
      const { ok, _body } = await requester
        .post("/api/sessions/register")
        .send(newUser);
      user.id = _body.payload;
      expect(ok).to.be.ok;
    });

    it("debe loguear al usuario y coseguir la cookie", async function () {
      const user = {
        email: "mauro_luque72@gmail.com",
        password: "123456ab",
      };
      const { ok, headers } = await requester
        .post("/api/sessions/login")
        .send(user);
      const cookieResult = headers["set-cookie"][0];
      cookie.name = cookieResult.split("=")[0];
      cookie.value = cookieResult.split("=")[1];
      expect(cookieResult).to.be.ok;
      expect(ok).to.be.ok;
      expect(cookie.name).to.be.ok.and.eql("coderCookie");
    });

    it("Debe enviar la cookie que contiene el usuario y destructurar éste correctamente", async function () {
      const { _body } = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(_body.payload.email).to.be.eql("mauro_luque72@gmail.com");
    });
  });

  describe("Tests de usuarios (users endpoints)", function () {
  let testUserId = null;

  before(async function () {
    const newUser = {
      first_name: "Carlos",
      last_name: "Gómez",
      email: "carlos_gomez@test.com",
      password: "test1234"
    };
    const { _body } = await requester.post("/api/sessions/register").send(newUser);
    testUserId = _body.payload;
  });

  it("GET /api/users debe devolver un array de usuarios", async function () {
    const { _body, statusCode } = await requester.get("/api/users");
    expect(statusCode).to.equal(200);
    expect(_body.status).to.equal("success");
    expect(_body.payload).to.be.an("array");
  });

  it("GET /api/users/:uid debe devolver un usuario específico", async function () {
    const { _body, statusCode } = await requester.get(`/api/users/${testUserId}`);
    expect(statusCode).to.equal(200);
    expect(_body.status).to.equal("success");
    expect(_body.payload).to.have.property("_id", testUserId);
  });

  it("GET /api/users/:uid con ID inválido debe devolver 404", async function () {
    const { statusCode, _body } = await requester.get("/api/users/000000000000000000000000");
    expect(statusCode).to.equal(404);
    expect(_body.error).to.equal("User not found");
  });

  it("PUT /api/users/:uid debe actualizar los datos del usuario", async function () {
    const update = { first_name: "CarlosActualizado" };
    const { _body, statusCode } = await requester.put(`/api/users/${testUserId}`).send(update);
    expect(statusCode).to.equal(200);
    expect(_body.status).to.equal("success");
    expect(_body.message).to.equal("User updated");
  });

  it("DELETE /api/users/:uid debe eliminar el usuario", async function () {
    const { _body, statusCode } = await requester.delete(`/api/users/${testUserId}`);
    expect(statusCode).to.equal(200);
    expect(_body.status).to.equal("success");
    expect(_body.message).to.equal("User deleted");
  });

  it("DELETE /api/users/:uid con ID inválido debe responder 200 aunque no exista", async function () {
    const { _body, statusCode } = await requester.delete("/api/users/000000000000000000000000");
    expect(statusCode).to.equal(200);
    expect(_body.status).to.equal("success");
    expect(_body.message).to.equal("User deleted");
  });
});

});
