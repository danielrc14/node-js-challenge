import request from 'supertest'
import app from '../app'
import RickAndMortyApiService from '../services/rick_and_morty_api_service'
import models from '../models'
const { ValidationError } = require('sequelize')

jest.mock('../services/rick_and_morty_api_service')
jest.mock('../models')

describe('Test getting N characters', () => {
  beforeEach(() => {
    jest.spyOn(
      RickAndMortyApiService.prototype,
      'getCharacters'
    ).mockResolvedValueOnce({
      results: new Array(20).fill({
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        origin: 'Earth'
      }),
      hasNext: true
    })
      .mockResolvedValueOnce({
        results: new Array(5).fill({
          name: 'Rick',
          status: 'Alive',
          species: 'Human',
          origin: 'Earth'
        }),
        hasNext: false
      })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('Test getting characters when there are pages left', () => {
    return request(app)
      .get('/character?N=10')
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body.results).toHaveLength(10)
      })
  })

  test('Test getting characters from all pages', () => {
    return request(app)
      .get('/character?N=21')
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body.results).toHaveLength(21)
      })
  })

  test('Test trying to get more characters than the total', () => {
    return request(app)
      .get('/character?N=40')
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body.results).toHaveLength(25)
      })
  })
})

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
