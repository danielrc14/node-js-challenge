import app from './app'

const port = process.env.PORT || 5000

const startServer = () => {
  app.listen(port, () => {
    console.log(`API running on http://127.0.0.1:${port}/`)
  })
}

startServer()
