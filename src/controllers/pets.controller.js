import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname, { createHash } from "../utils/index.js";
import { fa, faker } from '@faker-js/faker';
import { logger } from "../utils/logger.js";

const getAllPets = async(req,res)=>{
    const pets = await petsService.getAll();
    res.send({status:"success",payload:pets})
}

const getPet = async(req,res)=>{
    const pet = await petsService.getBy({_id:req.params.id});
    if(!pet) return res.status(404).send({status:'error',error:'pet not found'})
    res.send({status:"success",payload:pet})
}

const createPet = async(req,res)=> {
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}

const updatePet = async(req,res) =>{
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        if(!petId) res.status(400).send({status:'error',error:' not parametrer'})
        const result = await petsService.update(petId,petUpdateBody);
        res.status(200).send({status:"success",payload:result})
    } catch (error) {
        res.status(400).send({status:'error',error:error.message})
    }
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

const mockingpets = (req, res) => {
    const {q} = req.params
    const pets = []
    for(let i=0;i < Number(q);i++){
        const pet ={
            name: faker.animal.petName(),
            specie:faker.animal.type(),
            birthDate:faker.date.birthdate,
            adopted:false,
            owner:"",
            image:faker.image.animal

        }
        pets.push(pet)
    }

    res.status(200).json({status:"success", payload:pets})

}



const generateData = (req,res) => {
    const {u,p} = req.params
    for(let i=0;i < Number(p);i++){
        const pet ={
            name: faker.animal.petName(),
            specie:faker.animal.type(),
            birthDate:faker.date.birthdate,
            adopted:false,
            owner:"",
            image:faker.image.animal

        }
        // guardar en base de datos
    }

    for(let i=0;i < Number(u);i++){
        const user ={
            first_name: faker.person.firstName(),
            password: createHash(faker.internet.password()) 

        }
        // guardar en base de datos
    }


}


export default {
    getAllPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage,
    mockingpets
}