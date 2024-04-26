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
}
