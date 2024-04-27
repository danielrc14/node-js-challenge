import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Challenge',
      description: 'Code Challenge for Pinflag',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://127.0.0.1:5000',
        description: 'Local server'
      }
    ]
  },
  apis: ['./src/routes/*.js']
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs (app, port) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
export default swaggerDocs
