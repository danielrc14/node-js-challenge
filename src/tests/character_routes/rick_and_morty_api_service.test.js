import axios from 'axios'
import RickAndMortyApiService from '../../services/rick_and_morty_api_service'

jest.mock('axios')

describe('Test Rick and Morty API Service', () => {
  test('Test calling the character list endpoint', () => {
    const axiosGet = jest.fn().mockResolvedValue({
      data: {
        results: new Array(20).fill({
          name: 'Rick',
          status: 'Alive',
          species: 'Human',
          origin: { name: 'Earth' }
        }),
        info: {
          next: 'test'
        }
      }
    })
    axios.create.mockImplementation(() => {
      return {
        get: axiosGet
      }
    })

    const service = new RickAndMortyApiService()
    service.getCharacters()
      .then(response => {
        expect(axiosGet).toHaveBeenCalledWith('/character', {
          params: {
            page: 1
          }
        })
        expect(response).toEqual({
          results: new Array(20).fill({
            name: 'Rick',
            status: 'Alive',
            species: 'Human',
            origin: 'Earth'
          }),
          hasNext: true
        })
      })
  })

  test('Test calling the last page on the character list endpoint', () => {
    const axiosGet = jest.fn().mockResolvedValue({
      data: {
        results: new Array(20).fill({
          name: 'Rick',
          status: 'Alive',
          species: 'Human',
          origin: { name: 'Earth' }
        }),
        info: {
          next: null
        }
      }
    })
    axios.create.mockImplementation(() => {
      return {
        get: axiosGet
      }
    })

    const service = new RickAndMortyApiService()
    service.getCharacters(4)
      .then(response => {
        expect(axiosGet).toHaveBeenCalledWith('/character', {
          params: {
            page: 4
          }
        })
        expect(response).toEqual({
          results: new Array(20).fill({
            name: 'Rick',
            status: 'Alive',
            species: 'Human',
            origin: 'Earth'
          }),
          hasNext: false
        })
      })
  })

  test('Test calling the character by name endpoint', () => {
    const axiosGet = jest.fn().mockResolvedValue({
      data: {
        results: [{
          name: 'Rick',
          status: 'Alive',
          species: 'Human',
          origin: { name: 'Earth' }
        }],
        info: {
          count: 1
        }
      },
      status: 200
    })
    axios.create.mockImplementation(() => {
      return {
        get: axiosGet
      }
    })

    const service = new RickAndMortyApiService()
    service.getCharacterByName('Rick')
      .then(response => {
        expect(axiosGet).toHaveBeenCalledWith('/character?name=Rick')
        expect(response).toEqual(
          {
            name: 'Rick',
            status: 'Alive',
            species: 'Human',
            origin: 'Earth'
          }
        )
      })
  })

  test('Test calling the character by name endpoint with a 404', () => {
    const axiosGet = jest.fn().mockRejectedValue({
      response: {
        status: 404
      }
    })
    axios.create.mockImplementation(() => {
      return {
        get: axiosGet
      }
    })

    const service = new RickAndMortyApiService()
    service.getCharacterByName('Rick')
      .then(response => {
        expect(response).toBeUndefined()
      })
  })

  test('Test calling the character by name endpoint with another error', () => {
    const axiosGet = jest.fn().mockRejectedValue({
      response: {
        status: 403
      }
    })
    axios.create.mockImplementation(() => {
      return {
        get: axiosGet
      }
    })

    const service = new RickAndMortyApiService()
    service.getCharacterByName('Rick')
      .catch(error => {
        expect(error).toEqual({
          response: {
            status: 403
          }
        })
      })
  })

  test('Test response with unexpected data', () => {
    const axiosGet = jest.fn().mockResolvedValue({
      data: {
        info: {
          count: 0
        }
      },
      status: 200
    })
    axios.create.mockImplementation(() => {
      return {
        get: axiosGet
      }
    })

    const service = new RickAndMortyApiService()
    service.getCharacterByName('Rick')
      .then(response => {
        expect(response).toBeUndefined()
      })
  })
})
