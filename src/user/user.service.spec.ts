import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entity/user.entity'
import TestUtil from './../common/test/TestUtil'

describe('UserService', () => {
  let service: UserService;
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService, 
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockRepository.find.mockReset()
    mockRepository.findOne.mockReset()
    mockRepository.create.mockReset()
    mockRepository.save.mockReset()
    mockRepository.update.mockReset()
    mockRepository.delete.mockReset()
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When find all user', () => {
    it('should be list all user', async () => {
      const user = TestUtil.giveMeValidUser()
      mockRepository.find.mockReturnValue([user, user])
      const users = await service.findAllUsers()
      expect(users).toHaveLength(2)
      expect(mockRepository.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('When find one user', () => {
    it('should find a existing user', async () => {
      const user = TestUtil.giveMeValidUser()
      mockRepository.findOne.mockReturnValue(user)
      const userFound = await service.getUserById('1')
      expect(userFound).toMatchObject({ name: user.name })
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
    })
    it('should returned a exception when does not found a user', async () => {
      mockRepository.findOne.mockReturnValue(null)
      expect(service.getUserById('10000')).rejects.toBeInstanceOf(NotFoundException)
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe('When create a user', () => {
    it('should create a user', async () => {
      const user = TestUtil.giveMeValidUser()
      mockRepository.save.mockReturnValue(user)
      mockRepository.create.mockReturnValue(user)
      const savedUser = await service.createUser(user)
      expect(savedUser).toMatchObject(user)
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })
    it('should return a exception when doesnt create a user', async () => {
      const user = TestUtil.giveMeValidUser()
      mockRepository.save.mockReturnValue(null)
      mockRepository.create.mockReturnValue(user)
      await service.createUser(user).catch(e => {
        expect(e).toBeInstanceOf(InternalServerErrorException)
        expect(e).toMatchObject({
          message: 'Problem to create an user'
        })
      })
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('When update user', () => {
    it('should update a user', async () => {
      const user = TestUtil.giveMeValidUser()
      const updateUser = { name: 'Name updated' }
      mockRepository.findOne.mockReturnValue(user)
      mockRepository.update.mockReturnValue({
        ...user,
        ...updateUser
      })
      mockRepository.create.mockReturnValue({
        ...user,
        ...updateUser
      })
      const resultUser = await service.updateUser('1', {
        ...user,
        name: 'Name updated'
      })
      expect(resultUser).toMatchObject(updateUser)
      expect(mockRepository.create).toHaveBeenCalledTimes(1)
      expect(mockRepository.update).toHaveBeenCalledTimes(1)
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe('When delete user', () => {
    it('should delete a user', async () => {
      const user = TestUtil.giveMeValidUser()
      mockRepository.delete.mockReturnValue(user)
      mockRepository.findOne.mockReturnValue(user)
      const deleteUser = await service.delete('1')
      expect(deleteUser).toBe(true)
      expect(mockRepository.delete).toHaveBeenCalledTimes(1)
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
    })
    it('should not delete a inexistent user', async () => {
      const user = TestUtil.giveMeValidUser()
      mockRepository.delete.mockReturnValue(null)
      mockRepository.findOne.mockReturnValue(user)
      const deleteUser = await service.delete('2')
      expect(deleteUser).toBe(false)
      expect(mockRepository.delete).toHaveBeenCalledTimes(1)
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
    })
  })
});
