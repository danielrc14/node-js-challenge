import app from 'express'
import asyncHandler from 'express-async-handler'

import CharacterController from '../controllers/character_controller'

const routes = app.Router()

/**
 * @openapi
 * /character:
 *   get:
 *     summary: Retrieve a list of N characters.
 *     parameters:
 *       - name: N
 *         in: query
 *         description: The amount of characters to retrieve.
 *         required: false
 *     responses:
 *       200:
 *         description: The list of characters.
 */
routes.get(
  '/',
  asyncHandler(new CharacterController().index)
)

/**
 * @openapi
 * /character:
 *   post:
 *     summary: Create a new character on the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - status
 *               - species
 *               - origin
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *               species:
 *                 type: string
 *               origin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Character created.
 *       400:
 *         description: Malformed request or character already exists.
 *       500:
 *         description: Internal server error.
 */
routes.post(
  '/',
  asyncHandler(new CharacterController().create)
)

/**
 * @openapi
 * /character/{name}:
 *   get:
 *     summary: Get a character by a name.
 *     parameters:
 *       - name: name
 *         in: path
 *         description: The name or a part of the name of the character.
 *         required: true
 *     responses:
 *       200:
 *         description: The character data.
 *       404:
 *         description: Character not found.
 */
routes.get(
  '/:name',
  asyncHandler(new CharacterController().show)
)

export default routes
