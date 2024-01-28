export interface Place {
  name: string
  lat: number
  lng: number
  region: string
  population: number | undefined
}

export interface WeatherData {
  timestamp: string
  temperature: number | undefined
  windSpeed: number | undefined
  windDirection: number | undefined
}

export interface GetPlacesResponseData {
  data: {
    places: {
      city: string
      region: string
    }[]
  }
}

export interface GetWeatherDataResponseData {
  data: WeatherData
}

export class ValidationError extends Error {
  errorCode: number
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
    this.errorCode = 400
  }
}

export class BadRequestError extends Error {
  errorCode: number
  constructor(message: string) {
    super(message)
    this.name = 'BadRequestError'
    this.errorCode = 400
  }
}

export class InternalServerError extends Error {
  errorCode: number
  constructor(message: string) {
    super(message)
    this.name = 'InternalServerError'
    this.errorCode = 500
  }
}
