import express from 'express'

import './config/environment'
import routes from './routes'
import './models'

const app = express()

app.use(express.json())
app.use('/', routes)

export default app
