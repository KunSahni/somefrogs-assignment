export interface Place {
  city: string
  region: string
}

export interface WeatherConditions {
  timestamp: string
  temperature: number
  windDirection: number
  windSpeed: number
}

export interface WeatherData extends Place {
  conditions?: WeatherConditions
}
