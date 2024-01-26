import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import { getCities } from './routes/getCities'
import { getWeatherData } from './routes/getWeatherData'

dotenv.config()

const app: Express = express()
app.use(helmet())
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

app.post('/cities', async (req: Request, res: Response) => {
  const result = await getCities({
    searchTerm: req.body.searchTerm,
    pageSize: req.body.pageSize,
    currentPage: req.body.currentPage
  })
  res.send(result)
})

app.post('/weather', async (req: Request, res: Response) => {
  const result = await getWeatherData(req.body.city)
  res.send(result)
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
