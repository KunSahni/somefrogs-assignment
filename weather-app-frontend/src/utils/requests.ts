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

export const getLocalStorageItem = (key: string) => {
  const data = localStorage.getItem(key)
  try {
    if (!data) return null
    const dataAsJson = JSON.parse(data)
    if (dataAsJson.expirationTime) {
      if (new Date().getTime() > dataAsJson.expirationTime) {
        sessionStorage.removeItem(key)
        return null
      }
    }
    return dataAsJson.value
  } catch (err) {
    return null
  }
}

export const setLocalStorageItem = (key: string, value: any, ttlMs?: number) => {
  localStorage.setItem(
    key,
    JSON.stringify(
      ttlMs
        ? {
            value: value,
            expirationTime: new Date().getTime() + ttlMs
          }
        : { value }
    )
  )
}

export const getWeatherData = async (city: string): Promise<WeatherConditions | undefined> => {
  try {
    city = city.toLowerCase()
    const cachedData = getLocalStorageItem('weather_' + city)
    if (cachedData) return cachedData
    const response = await fetch(`http://localhost:3000/weather`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ place: city })
    })
    if (isResponseOk(response)) {
      const data = await getResponseData(response)
      const weatherConditions: WeatherConditions = {
        timestamp: data.timestamp,
        temperature: data.temperature ?? undefined,
        windDirection: data.windDirection ?? undefined,
        windSpeed: data.windSpeed ?? undefined
      }
      // Cache for 10 minutes from the timestamp of the weather data
      const expirationTime = new Date(weatherConditions.timestamp).getTime() + 10 * 60 * 1000
      const ttlMs = expirationTime - new Date().getTime()
      setLocalStorageItem('weather_' + city, weatherConditions, ttlMs)
      return weatherConditions
    }
    return undefined
  } catch (error) {
    console.log('Failed to retrieve weather data. (error: 58610982)', error)
    return undefined
  }
}

export const getPlaces = async (searchTerm: string, pageSize: number, currentPage: number): Promise<Place[]> => {
  try {
    searchTerm = searchTerm.toLowerCase()
    const cachedData = getLocalStorageItem('places_' + searchTerm + '_' + pageSize + '_' + currentPage)
    if (cachedData) return cachedData
    const response = await fetch(`http://localhost:3000/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ searchTerm: searchTerm, pageSize: pageSize, currentPage: currentPage })
    })
    if (isResponseOk(response)) {
      const data = await getResponseData(response)
      setLocalStorageItem('places_' + searchTerm + '_' + pageSize + '_' + currentPage, data.places, 60 * 60 * 1000)
      return data.places as Place[]
    }
    return []
  } catch (error) {
    console.log('Failed to retrieve places. (error: 09715762)', error)
    return []
  }
}
