import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import { getPlaces } from './routes/getPlaces'
import { getWeatherData } from './routes/getWeatherData'
import { BadRequestError, GetPlacesResponseData, InternalServerError, ValidationError } from './types'
import { validateGetPlacesRequest, validateGetWeatherRequest } from './utils/validators'

dotenv.config()

const app: Express = express()
app.use(helmet())
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

app.post('/places', async (req: Request, res: Response) => {
  try {
    validateGetPlacesRequest(req)
    const result: GetPlacesResponseData = await getPlaces({
      searchTerm: req.body.searchTerm,
      pageSize: req.body.pageSize,
      currentPage: req.body.currentPage
    })
    res.send({
      status: 200,
      data: result.data
    })
  } catch (error: any) {
    if (error instanceof InternalServerError || error instanceof ValidationError || error instanceof BadRequestError)
      res.send({
        status: error.errorCode,
        message: error.message
      })
    else
      res.send({
        status: 500,
        message: 'Internal server error'
      })
  }
})

app.post('/weather', async (req: Request, res: Response) => {
  try {
    validateGetWeatherRequest(req)
    const result = await getWeatherData(req.body.place)
    res.send({
      status: 200,
      data: result.data
    })
  } catch (error: any) {
    if (error instanceof InternalServerError || error instanceof ValidationError || error instanceof BadRequestError)
      res.send({
        status: error.errorCode,
        message: error.message
      })
    else
      res.send({
        status: 500,
        message: 'Internal server error'
      })
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
