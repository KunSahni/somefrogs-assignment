export interface Response {
  status: number
  message: string
  data?: any | undefined
}

export interface GetCitiesResponse extends Response {
  data:
    | {
        cities: string[]
      }
    | undefined
}

export interface GetWeatherDataResponse extends Response {
  data:
    | {
        timestamp: string
        temperature: number
        windSpeed: number
        windDirection: number
      }
    | undefined
}

export interface City {
  name: string
  lat: number
  lng: number
  region: string
  population: number | undefined
}
