const { User } = require('../models/users');
const UserDTO = require('../dao/DTOs/user.dto');
const BaseRepository = require('./base.repository');
const CurrentDTO = require('../dao/DTOs/current.dto');
const GetPrincipalDataUser = require('../dao/DTOs/getPrincipalDataUser');
const req = require('../utils/logger/loggerSetup');

class UsersRepository extends BaseRepository {
  constructor() {
    super(User);
  }
  findUserById = async (id, populateOptions = {}) => {
    try {
      const item = await this.model.findById(id).populate(populateOptions).exec();
      if (!item) {
        return null;
      }
      return item;
    } catch (error) {
      req.logger.error('Error in UserRepository findUserById:', error);
      throw new Error(`Error in UserRepository findUserById: ${error.message}`);
    }
  };
  createUserDTO = async (user) => {
    try {
      const userDTO = new UserDTO(user);
      const newUser = new User(userDTO);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      req.logger.error('Error in UserRepository createUserDto:', error);
      throw new Error(`Error in UserRepository createUserDto: ${error.message}`);
    }
  };
  getUserWithCurrentDTO = async (user) => {
    try {
      const currentDTO = new CurrentDTO(user);
      return currentDTO;
    } catch (error) {
      req.logger.error('Error in UserRepository getUserDto:', error);
      throw new Error(`Error in UserRepository getUserDto: ${error.message}`);
    }
  };
  getPrincipalDataUserDTO = async (user) => {
    try {
      const principalDataUserDTO = new GetPrincipalDataUser(user);
      return principalDataUserDTO;
    } catch (error) {
      req.logger.error('Error in UserRepository getPrincipalDataUserDto:', error);
      throw new Error(`Error in UserRepository getPrincipalDataUserDto: ${error.message}`);
    }
  };
}
module.exports = UsersRepository;
