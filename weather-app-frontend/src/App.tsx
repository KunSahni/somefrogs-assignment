import { SimpleGrid } from '@mantine/core'
import { useEffect, useState } from 'react'
import { InputField } from './components/InputField'
import { PrimaryTitle } from './components/Text'
import { WeatherCard } from './components/WeatherCard'
import { Place } from './types'
import { getPlaces } from './utils/requests'
import { validateString } from './utils/validators'

function App() {
  const pageSize: number = 9

  const [places, setPlaces] = useState<Place[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchTermError, setSearchTermError] = useState<string | undefined>()
  const [currentPage, setCurrentPage] = useState<number>(0)

  const fetchPlaces = async (
    searchTerm: string,
    pageSize: number,
    currentPage: number,
    erasePreviousContent: boolean
  ) => {
    if (erasePreviousContent) setCurrentPage(0)
    const updatedPlaces = await getPlaces(searchTerm, pageSize, erasePreviousContent ? 0 : currentPage)
    setPlaces(erasePreviousContent ? updatedPlaces : [...places, ...updatedPlaces])
  }

  useEffect(() => {
    fetchPlaces(searchTerm, pageSize, currentPage, true)
  }, [searchTerm])

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
        {places.map((place, index) => {
          if (index === places.length - 1)
            return (
              <WeatherCard
                key={index}
                place={place}
                inViewCallback={() => {
                  fetchPlaces(searchTerm, pageSize, currentPage + 1, false)
                  setCurrentPage((prev) => prev + 1)
                }}
              />
            )
          return <WeatherCard key={index} place={place} />
        })}
      </SimpleGrid>
    </div>
  )
}

export default App
