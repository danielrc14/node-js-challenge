import models from '../models'
import BaseController from './base'
import RickAndMortyApiService from '../services/rick_and_morty_api_service'

export default class CharacterController extends BaseController {
  CharacterController () { }

  async index (req, res) {
    const N = req.query.N || 20
    const rickAndMortyApiService = new RickAndMortyApiService()

    let page = 1
    let totalAmount = 0
    const characters = []
    while (totalAmount < N) {
      const data = await rickAndMortyApiService.getCharacters(page)

      const pageCharacters = data.results
      characters.push(...pageCharacters)

      if (!data.hasNext) {
        break
      }

      totalAmount += pageCharacters.length
      page += 1
    }

    if (characters.length > N) {
      characters.length = N
    }

    return super.Success(res, {
      results: characters,
      count: characters.length
    })
  }

  async create (req, res) {
    return super.Success(res, '')
  }

  async show (req, res) {
    return super.Success(res, '')
  }
}
