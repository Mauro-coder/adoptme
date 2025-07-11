import __dirname from "./index.js";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación del proyecto AdoptMe",
      description: "API pensada para AdoptMe",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};