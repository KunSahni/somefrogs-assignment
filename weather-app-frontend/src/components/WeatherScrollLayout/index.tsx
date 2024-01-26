import { WeatherData } from '../../types'
import { WeatherCard } from '../WeatherCard'
import './style.scss'

export interface WeatherScrollLayoutProps {
  weatherData: WeatherData[]
}

export const WeatherScrollLayout = (props: WeatherScrollLayoutProps) => {
  return (
    <div className="weatherScrollLayout">
      {props.weatherData.map((data, index) => (
        <WeatherCard key={index} weatherData={data} />
      ))}
    </div>
  )
}
