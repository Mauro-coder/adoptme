import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import PetDTO from "../dto/Pet.dto.js";
import { usersService, petsService } from "../services/index.js";

const mockingPets =  (req, res) =>{
    const {q} = req.params;
    const pets = [];
    for(let i=0;i < Number(q);i++){
        const pet = {
            name: faker.animal.petName(),
            specie: faker.animal.type(),
            birthDate: faker.date.birthdate(),
            adopted: false,
            owner:"",
            image: faker.image.animal,
        }
        pets.push(pet);
    }
    res.status(200).json({status: "success", payload: pets});
}

const mockingUsers = async (req, res) => {
    const users = [];
    const hashedPassword = await bcrypt.hash("coder123", 10);

    for (let i = 0; i < 50; i++) {
        const user = {
            _id: new mongoose.Types.ObjectId(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int({ min: 18, max: 80 }),
            password: hashedPassword,
            role: faker.helpers.arrayElement(["user", "admin"]),
            pets: [],
        };
        users.push(user);
    }

    res.status(200).json({ status: "success", payload: users });
};

const generateData = async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;
        const hashedPassword = await bcrypt.hash("coder123", 10);

        // Crear usuarios
        const createdUsers = [];
        for (let i = 0; i < Number(users); i++) {
            const userData = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                age: faker.number.int({ min: 18, max: 80 }),
                password: hashedPassword,
                role: faker.helpers.arrayElement(["user", "admin"]),
                pets: []
            };
            const user = await usersService.create(userData);
            createdUsers.push(user);
        }

        // Crear mascotas
        for (let i = 0; i < Number(pets); i++) {
            const fakePet = {
                name: faker.animal.petName(),
                specie: faker.animal.type(),
                image: faker.image.urlLoremFlickr({ category: "animals" }),
                birthDate: faker.date.birthdate()
            };
            const petData = PetDTO.getPetInputFrom(fakePet);
            await petsService.create(petData);
        }

        res.status(201).json({
            status: "success",
            message: `Se generaron ${users} usuarios y ${pets} mascotas correctamente`
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Ocurrió un error al generar los datos",
            error: error.message
        });
    }
};


export default {mockingPets, mockingUsers, generateData}