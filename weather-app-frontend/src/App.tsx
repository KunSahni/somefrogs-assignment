import { SimpleGrid } from '@mantine/core'
import { useEffect, useState } from 'react'
import { InputField } from './components/InputField'
import { PrimaryTitle } from './components/Text'
import { WeatherCard } from './components/WeatherCard'
import { Place, WeatherData } from './types'
import { getPlaces, getWeatherData } from './utils/requests'
import { validateString } from './utils/validators'

function App() {
  const [places, setPlaces] = useState<Place[]>([])
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchTermError, setSearchTermError] = useState<string | undefined>()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const pageSize: number = 9

  useEffect(() => {
    const asyncFunc = async () => {
      const places = await getPlaces(searchTerm, pageSize, currentPage)
      setPlaces(places)
    }
    asyncFunc()
  }, [searchTerm])

  useEffect(() => {
    const asyncFunc = async () => {
      setWeatherData([])
      places.forEach(async (place) => {
        const weatherConditions = await getWeatherData(place.city)
        setWeatherData((prev) => [
          ...prev,
          {
            city: place.city,
            region: place.region,
            conditions: {
              temperature: weatherConditions?.temperature ?? undefined,
              windSpeed: weatherConditions?.windSpeed ?? undefined,
              windDirection: weatherConditions?.windDirection ?? undefined,
              timestamp: weatherConditions?.timestamp
            }
          } as WeatherData
        ])
      })
    }
    asyncFunc()
  }, [places])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PrimaryTitle style={{ width: 'fit-content' }}>Weather App</PrimaryTitle>
      <InputField
        label={'Search for a city'}
        name={'SearchTerm'}
        type={'text'}
        value={searchTerm}
        onChange={(e) => {
          const updatedSearchTerm = e.target.value
          const validationResult = validateString(updatedSearchTerm)
          if (updatedSearchTerm !== '' && validationResult !== true) setSearchTermError(validationResult)
          else setSearchTermError(undefined)
          setSearchTerm(e.target.value)
        }}
        required={false}
        error={searchTermError}
      />
      <SimpleGrid
        cols={3}
        spacing="2rem"
        verticalSpacing="2rem"
        breakpoints={[
          { maxWidth: '64rem', cols: 2, spacing: '1.5rem', verticalSpacing: '1.5rem' },
          { maxWidth: '32rem', cols: 1, spacing: '1rem', verticalSpacing: '1rem' }
        ]}
      >
        {weatherData.map((data, index) => (
          <WeatherCard key={index} weatherData={data} />
        ))}
      </SimpleGrid>
    </div>
  )
}

export default App
