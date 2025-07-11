import Users from "../src/dao/Users.dao.js";
import mongoose from "mongoose";
import { expect } from 'chai'
import dotenv from 'dotenv'

dotenv.config()
mongoose.connect(process.env.MONGO_URI)


describe('Testing users dao', function(){

    before(function(){
        this.users = new Users()
        mongoose.connection.collections.users.drop()
    })

    it('El dao debe poder obtener los usuarios en forma de arraglo',async function(){
        const result = await this.users.get()
        expect(result).to.be.an('array')
    })

    it("El Dao debe agregar correctamente un elemento a la base de datos",async function(){
        const user = {
            first_name: "Mauro",
            last_name: "Luque",
            email: "mauro_luque@hotmail.com",
            password:"123456"
        }
        const result = await this.users.save(user);
        expect(result.first_name).to.equal(user.first_name)

    })

    it("Al agregar un nuevo usuario, éste debe crearse con un arreglo de mascotas vacío por defecto",async function(){
        const user = {
            first_name: "Mauro",
            last_name: "Luque",
            email: "mauro_luque@hotmail.com",
            password:"123456"
        }
        const result = await this.users.save(user);
        expect(result.pets).to.be.deep.equal([])
    })

    it("El Dao puede obtener a un usuario por email",async function(){
        const user = {
            first_name: "Mauro",
            last_name: "Luque",
            email: "mauro_luque@hotmail.com",
            password:"123456"
        }
        const userCreated = await this.users.save(user);
        const userFound = await this.users.getBy({email:userCreated.email});
        expect(userFound.email).to.be.equal(userCreated.email)
    })
       



})