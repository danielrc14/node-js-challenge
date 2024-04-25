import app from 'express'
import asyncHandler from 'express-async-handler'

import CharacterController from '../controllers/character_controller'

const routes = app.Router()

routes.get(
  '/',
  asyncHandler(new CharacterController().index)
)

routes.post(
  '/',
  asyncHandler(new CharacterController().create)
)

routes.get(
  '/',
  asyncHandler(new CharacterController().show)
)

export default routes
