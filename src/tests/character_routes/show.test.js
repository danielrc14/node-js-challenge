import request from 'supertest'
import app from '../../app'
import RickAndMortyApiService from '../../services/rick_and_morty_api_service'
import models from '../../models'

jest.mock('../../services/rick_and_morty_api_service')
jest.mock('../../models')

describe('Test getting a character', () => {
  test('Test getting a character that exists in the database', () => {
    jest.spyOn(models.Character, 'findOne').mockImplementation(() => {
      return {
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        origin: 'Earth'
      }
    })

    return request(app)
      .get('/character/Rick')
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
          name: 'Rick',
          status: 'Alive',
          species: 'Human',
          origin: 'Earth'
        })
      })
  })

  test('Test getting a character that does not exist in the database', () => {
    jest.spyOn(models.Character, 'findOne').mockImplementation(() => {
      return null
    })

    jest.spyOn(RickAndMortyApiService.prototype, 'getCharacterByName')
      .mockResolvedValueOnce({
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        origin: 'Earth'
      })

    return request(app)
      .get('/character/Rick')
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
          name: 'Rick',
          status: 'Alive',
          species: 'Human',
          origin: 'Earth'
        })
      })
  })

  test('Test getting a character that does not exist in either the DB or the API', () => {
    jest.spyOn(models.Character, 'findOne').mockImplementation(() => {
      return null
    })

    jest.spyOn(RickAndMortyApiService.prototype, 'getCharacterByName')
      .mockResolvedValueOnce(undefined)

    return request(app)
      .get('/character/Rick')
      .then(response => {
        expect(response.statusCode).toBe(404)
      })
  })
})
