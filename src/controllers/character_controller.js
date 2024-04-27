import models from '../models'
import BaseController from './base'
import RickAndMortyApiService from '../services/rick_and_morty_api_service'
const { Op, ValidationError } = require('sequelize')

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
      results: characters
    })
  }

  async create (req, res) {
    let created

    try {
      const data = await models.Character.findOrCreate({
        where: { name: req.body.name },
        defaults: {
          status: req.body.status,
          species: req.body.species,
          origin: req.body.origin
        }
      })
      created = data[1]
    } catch (error) {
      if (error instanceof ValidationError) {
        // If there are more than one validation errors, show only the first one
        return super.ErrorBadRequest(res, {
          message: error.errors[0].message
        })
      }
      // General error catching
      return super.InternalError(res, error)
    }

    if (created) {
      return super.Success(res, {
        message: 'Character created successfully'
      })
    } else {
      return super.ErrorBadRequest(res, {
        message: 'Character already exists'
      })
    }
  }

  async show (req, res) {
    let character = await models.Character.findOne({
      attributes: ['name', 'status', 'species', 'origin'],
      where: {
        name: { [Op.iLike]: `%${req.params.name}%` }
      }
    })

    if (!character) {
      const rickAndMortyApiService = new RickAndMortyApiService()
      character = await rickAndMortyApiService.getCharacterByName(req.params.name)
    }

    if (!character) {
      return super.NotFound(res, {
        message: 'Character not found'
      })
    }

    return super.Success(res, character)
  }
}
