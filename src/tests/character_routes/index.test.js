import request from 'supertest'
import app from '../../app'
import RickAndMortyApiService from '../../services/rick_and_morty_api_service'

jest.mock('../../services/rick_and_morty_api_service')

beforeEach(() => {
  jest.spyOn(RickAndMortyApiService.prototype, 'getCharacters')
    .mockResolvedValueOnce({
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

describe('Test getting N characters', () => {
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
