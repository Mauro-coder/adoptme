import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import { faker } from '@faker-js/faker';
import { logger } from "../utils/logger.js";

const getAllPets = async(req,res)=>{
    const pets = await petsService.getAll();
    res.send({status:"success",payload:pets})
}

const createPet = async(req,res)=> {
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}

const updatePet = async(req,res) =>{
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    const result = await petsService.update(petId,petUpdateBody);
    res.send({status:"success",message:"pet updated"})
}

const deletePet = async(req,res)=> {
    const petId = req.params.pid;
    const result = await petsService.delete(petId);
    res.send({status:"success",message:"pet deleted"});
}

const createPetWithImage = async(req,res) =>{
    try {
        const file = req.file;
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image:`${__dirname}/../public/img/${file.filename}`
        });
        logger.info(pet);
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    } catch (error) {
        logger.error(`error create pet ${new Date().toLocaleDateString()}`)
        res.status(400).send({status:"error"})
    }
}

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

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage,
    mockingPets,
}