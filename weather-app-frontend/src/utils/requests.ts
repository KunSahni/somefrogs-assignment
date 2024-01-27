import { Place, WeatherConditions } from '../types'

const isResponseOk = (response: Response) => {
  if (response.status === 200) return true
  return false
}

const getResponseData = async (response: Response): Promise<any> => {
  if (response.body === null) throw new Error('Response body is null')
  const data = (await response.json()).data
  return data
}

export const getWeatherData = async (city: string): Promise<WeatherConditions | undefined> => {
  try {
    const response = await fetch(`http://localhost:3000/weather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ place: city })
    })
    if (isResponseOk(response)) {
      const data = await getResponseData(response)
      return {
        timestamp: data.timestamp,
        temperature: data.temperature,
        windDirection: data.windDirection,
        windSpeed: data.windSpeed
      } as WeatherConditions
    }
    return undefined
  } catch (error) {
    console.log('Failed to retrieve weather data. (error: 58610982)', error)
    return undefined
  }
}

export const getPlaces = async (searchTerm: string, pageSize: number, currentPage: number): Promise<Place[]> => {
  try {
    const response = await fetch(`http://localhost:3000/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ searchTerm: searchTerm, pageSize: pageSize, currentPage: currentPage })
    })
    if (isResponseOk(response)) {
      const data = await getResponseData(response)
      return data.places as Place[]
    }
    return []
  } catch (error) {
    console.log('Failed to retrieve places. (error: 09715762)', error)
    return []
  }
}
