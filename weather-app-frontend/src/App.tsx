import { ChangeEvent, useEffect, useState } from 'react'
import { IconButton, PrimaryButton, SecondaryButton } from './components/Button'
import { InputField } from './components/InputField'
import { PrimaryTitle, SecondaryTitle } from './components/Text'
import { WeatherCard } from './components/WeatherCard'
import { WeatherScrollLayout } from './components/WeatherScrollLayout'
import { WeatherData } from './types'
import { getCities, getWeatherData } from './utils/requests'

function App() {
  const [cities, setCities] = useState<string[]>([])
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])

  useEffect(() => {
    const asyncFunc = async () => {
      const response = await getCities('', 10, 0)
      setCities(response.data.cities)
    }
    asyncFunc()
  }, [])

  useEffect(() => {
    const asyncFunc = async () => {
      cities.forEach(async (city) => {
        const response = await getWeatherData(city)
        setWeatherData((prev) => [
          ...prev,
          {
            place: city,
            region: city,
            conditions: {
              temperature: response.data.temperature,
              windSpeed: response.data.windSpeed,
              windDirection: response.data.windDirection,
              timestamp: response.data.timestamp
            }
          }
        ])
      })
    }
    asyncFunc()
  }, [cities])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PrimaryTitle style={{ width: 'fit-content' }}>Weather App</PrimaryTitle>
      <InputField
        label={''}
        name={''}
        type={'number'}
        value={undefined}
        onChange={function (event: ChangeEvent<HTMLInputElement>): void {
          throw new Error('Function not implemented.')
        }}
        required={false}
      />
      <WeatherScrollLayout weatherData={weatherData} />
    </div>
  )
}

export default App
