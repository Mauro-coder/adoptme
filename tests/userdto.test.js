import { expect } from 'chai'
import UserDTO from '../src/dto/User.dto.js' // ajustá la ruta según tu proyecto

describe('UserDTO', function () {

  const mockUser = {
    first_name: "Mauro",
    last_name: "Luque",
    email: "mauro@test.com",
    password: "123456",
    role: "user"
  }

  it('Debe unificar first_name y last_name en una sola propiedad "name"', function () {
    const result = UserDTO.getUserTokenFrom(mockUser)

    expect(result).to.have.property('name', 'Mauro Luque')
    expect(result).to.have.property('email', mockUser.email)
    expect(result).to.have.property('role', mockUser.role)
  })

  it('Debe eliminar propiedades innecesarias como password, first_name y last_name', function () {
    const result = UserDTO.getUserTokenFrom(mockUser)

    expect(result).to.not.have.property('password')
    expect(result).to.not.have.property('first_name')
    expect(result).to.not.have.property('last_name')
  })

})