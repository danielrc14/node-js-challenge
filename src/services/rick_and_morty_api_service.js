import axios from 'axios'

export default class RickAndMortyApiService {
  constructor () {
    this.axiosInstance = axios.create({
      baseURL: 'https://rickandmortyapi.com/api'
    })
  }

  async getCharacters (page = 1) {
    const response = await this.axiosInstance.get('/character', {
      params: {
        page: page
      }
    })
    const mappedResults = response.data.results.map(character => {
      return {
        name: character.name,
        status: character.status,
        species: character.species,
        origin: character.origin.name
      }
    })
    return {
      results: mappedResults,
      hasNext: response.data.info.next !== null
    }
  }

  async getCharacterByName (name) {
    let response
    try {
      response = await this.axiosInstance.get(`/character?name=${name}`)
    } catch (error) {
      if (error.response.status === 404) {
        return undefined
      }
      throw error
    }
    if (response.status === 200 && response.data.info.count > 0) {
      const result = response.data.results[0]
      return {
        name: result.name,
        status: result.status,
        species: result.species,
        origin: result.origin.name
      }
    }
    return undefined
  }
}
