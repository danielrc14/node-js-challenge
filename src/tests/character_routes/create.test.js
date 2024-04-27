import request from 'supertest'
import app from '../../app'
import models from '../../models'
const { ValidationError } = require('sequelize')

jest.mock('../../models')

describe('Test creating characters', () => {
  test('Test creating a character successfully', () => {
    jest.spyOn(models.Character, 'findOrCreate').mockImplementation(() => {
      return [{}, true]
    })

    return request(app)
      .post('/character')
      .send({
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        origin: 'Earth'
      })
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(models.Character.findOrCreate).toHaveBeenCalledWith({
          where: { name: 'Rick' },
          defaults: {
            status: 'Alive',
            species: 'Human',
            origin: 'Earth'
          }
        })
      })
  })

  test('Test validation error', () => {
    jest.spyOn(models.Character, 'findOrCreate').mockImplementation(() => {
      const error = new ValidationError()
      error.errors = [{ message: 'Validation error' }]
      throw error
    })

    return request(app)
      .post('/character')
      .send({
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        origin: 'Earth'
      })
      .then(response => {
        expect(response.statusCode).toBe(400)
      })
  })

  test('Test general error', () => {
    jest.spyOn(models.Character, 'findOrCreate').mockImplementation(() => {
      throw new Error()
    })

    return request(app)
      .post('/character')
      .send({
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        origin: 'Earth'
      })
      .then(response => {
        expect(response.statusCode).toBe(500)
      })
  })

  test('Test character already exists', () => {
    jest.spyOn(models.Character, 'findOrCreate').mockImplementation(() => {
      return [{}, false]
    })
    return request(app)
      .post('/character')
      .send({
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        origin: 'Earth'
      })
      .then(response => {
        expect(response.statusCode).toBe(400)
      })
  })
})