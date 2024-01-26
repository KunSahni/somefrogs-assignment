export interface WeatherConditions {
  timestamp: string
  temperature: number
  windDirection: number
  windSpeed: number
}

export interface WeatherData {
  place: string
  region: string
  conditions: WeatherConditions
}

export interface WeatherDataExtended extends WeatherData {
  forecast: WeatherConditions[]
}
