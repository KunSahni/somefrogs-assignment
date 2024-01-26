import { ChangeEvent } from 'react'
import { PrimaryButton, SecondaryButton } from './components/Button'
import { InputField } from './components/InputField'
import { PrimaryTitle } from './components/Text'
import { WeatherCard } from './components/WeatherCard'
import { WeatherScrollLayout } from './components/WeatherScrollLayout'
import { WeatherData } from './types'

function App() {
  const mockData: WeatherData[] = [
    {
      place: 'Helsinki',
      region: 'Uusimaa',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-04-12T12:00:00Z'
      }
    },
    {
      place: 'Espoo',
      region: 'Uusimaa',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-04-12T12:00:00Z'
      }
    },
    {
      place: 'Vantaa',
      region: 'Uusimaa',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-04-12T12:00:00Z'
      }
    },
    {
      place: 'Tampere',
      region: 'Pirkanmaa',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-04-12T12:00:00Z'
      }
    },
    {
      place: 'Turku',
      region: 'Varsinais-Suomi',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-04-12T12:00:00Z'
      }
    },
    {
      place: 'Oulu',
      region: 'Pohjois-Pohjanmaa',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-04-12T12:00:00Z'
      }
    },
    {
      place: 'Lahti',
      region: 'Päijät-Häme',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-04-12T12:00:00Z'
      }
    },
    {
      place: 'Kuopio',
      region: 'Pohjois-Savo',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-04-12T12:00:00Z'
      }
    },
    {
      place: 'Jyväskylä',
      region: 'Keski-Suomi',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-04-12T12:00:00Z'
      }
    },
    {
      place: 'Pori',
      region: 'Satakunta',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: '2021-05-12T12:00:00Z'
      }
    },
    {
      place: 'Lappeenranta',
      region: 'Etelä-Karjala',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: new Date().toISOString()
      }
    },
    {
      place: 'Rovaniemi',
      region: 'Lappi',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: new Date().toISOString()
      }
    },
    {
      place: 'Vaasa',
      region: 'Pohjanmaa',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: new Date().toISOString()
      }
    },
    {
      place: 'Kotka',
      region: 'Kymenlaakso',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: new Date().toISOString()
      }
    },
    {
      place: 'Joensuu',
      region: 'Pohjois-Karjala',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: new Date().toISOString()
      }
    },
    {
      place: 'Hämeenlinna',
      region: 'Kanta-Häme',
      conditions: {
        temperature: 5.01,
        windSpeed: 10,
        windDirection: 345,
        timestamp: new Date().toISOString()
      }
    }
  ]
  return (
    <>
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
      <WeatherScrollLayout weatherData={mockData} />
    </>
  )
}

export default App
