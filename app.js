import express, { json, urlencoded } from 'express'
import { join, dirname } from 'path'
import router from './routes/index.js'
import morgan from 'morgan'

import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const port = 3000
const app = express()

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan('combined'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(express.static('public'))

app.use('/', router)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
