# AdoptMe 🐾

**AdoptMe** es una aplicación backend para la adopción de mascotas, desarrollada con **Node.js**, **Express**, **MongoDB** y **Mongoose**. Incluye manejo de usuarios, mascotas, autenticación, subida de imágenes y tests automatizados.

---

## 📋 Contenidos

- [🚀 Características](#-características)
- [🛠️ Tecnologías](#️-tecnologías)
- [⚙️ Instalación](#️-instalación)
- [🔑 Variables de Entorno](#️-variables-de-entorno)
- [🚴‍♂️ Scripts](#️-scripts)
- [🧪 Testing](#️-testing)
- [📂 Estructura](#️-estructura)
- [📊 Endpoints](#️-endpoints)
- [📣 Contribuciones](#️-contribuciones)
- [📝 Licencia](#️-licencia)

---

## 🚀 Características

- Registro, login y manejo de sesión de usuarios
- CRUD de usuarios y mascotas
- Subida de imágenes (perfil y mascotas) con **Multer**
- DTO para filtrar propiedades sensibles
- Validaciones y manejo de errores
- Documentation de pruebas con **Mocha**, **Chai** y **Supertest**

---

## 🛠️ Tecnologías

- **Node.js**
- **Express**
- **MongoDB** + **Mongoose**
- **Multer** (uploads)
- **dotenv** (entorno)
- **Mocha**, **Chai**, **Supertest** (testing)
- (Opcional) **bcrypt**, **jsonwebtoken** para auth

---

## ⚙️ Instalación

1. Cloná el repo:

   ```bash
   git clone https://github.com/Mauro-coder/adoptme.git
   cd adoptme
   ```

2. Instalá dependencias:

   ```bash
   npm install
   ```

3. Configurá el archivo `.env` (ver detalle abajo).

4. Iniciá el servidor:

   ```bash
   npm run dev
   ```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz con al menos las siguientes variables:

```env
PORT=
MONGO_URL=
JWT_SECRET=
```

---

## 🚴‍♂️ Scripts Disponibles

- `npm run dev` – Ejecuta el servidor en modo desarrollo (con nodemon)
- `npm start` – Corre el servidor directamente
- `npm test` – Ejecuta la suite de tests (Mocha + Chai + Supertest)
- `npm run lint` – (Implementar) Lint con ESLint

---

## 🧪 Testing

Se utilizan **Mocha**, **Chai** y **Supertest**:

```bash
npm test
```

Cubre:

- DTOs
- CRUD de usuarios
- CRUD de mascotas (incluyendo subida de imágenes)

---

## 📂 Estructura del Proyecto

```
/src
 ├─ controllers/
 ├─ daos/
 ├─ dtos/
 ├─ routes/
 ├─ services/
 ├─ public/img/ (uploads)
 ├─ app.js / server.js
/tests
 ├─ userdao.test.js
 ├─ userdto.test.js
 └─ pets.test.js
```

---

## 📊 Endpoints Disponibles

### 🧑‍🤝🧑 Usuarios

- `GET /api/users`
- `GET /api/users/:uid`
- `PUT /api/users/:uid`
- `DELETE /api/users/:uid`

### 🐾 Mascotas

- `GET /api/pets`
- `POST /api/pets`
- `POST /api/pets/withimage`
- `PUT /api/pets/:pid`
- `DELETE /api/pets/:pid`

### 🔐 Autenticación

- `POST /api/sessions/register`
- `POST /api/sessions/login`
- `GET /api/sessions/current`
