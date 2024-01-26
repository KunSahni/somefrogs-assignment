import { WeatherData } from '../../types'
import { WeatherCard } from '../WeatherCard'
import { SimpleGrid } from '@mantine/core'
import './style.scss'

export interface WeatherScrollLayoutProps {
  weatherData: WeatherData[]
}

export const WeatherScrollLayout = (props: WeatherScrollLayoutProps) => {
  return (
    <SimpleGrid
      cols={3}
      spacing="2rem"
      verticalSpacing="2rem"
      breakpoints={[
        { maxWidth: '64rem', cols: 2, spacing: '1.5rem', verticalSpacing: '1.5rem' },
        { maxWidth: '32rem', cols: 1, spacing: '1rem', verticalSpacing: '1rem' }
      ]}
    >
      {props.weatherData.map((data, index) => (
        <WeatherCard key={index} weatherData={data} />
      ))}
    </SimpleGrid>
  )
}
