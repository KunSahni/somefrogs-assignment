import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { WeatherData } from '../../types'
import { PrimaryParagraph, SecondaryParagraph } from '../Text'
import './style.scss'

interface WeatherCardProps {
  weatherData: WeatherData
  testId?: string
  error?: string
  style?: React.CSSProperties
}

export const WeatherCard = (props: WeatherCardProps) => {
  const [isTimestampRecent, setIsTimestampRecent] = useState(false)

  useEffect(() => {
    const timestamp = new Date(props.weatherData.conditions.timestamp)
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const diffInHours = diff / (1000 * 3600)
    setIsTimestampRecent(diffInHours < 1)
  }, [props.weatherData.conditions.timestamp])

  return (
    <AnimatePresence>
      <motion.div className="weatherCard" style={props.style}>
        <video src="/videos/backgroundVideo.mp4" className="backgroundVideo" autoPlay muted loop />
        <motion.div className="infoColumn">
          <PrimaryParagraph>{props.weatherData.place}</PrimaryParagraph>
          <SecondaryParagraph>{props.weatherData.region}</SecondaryParagraph>
          <SecondaryParagraph style={{ marginTop: 'auto' }}>
            {isTimestampRecent ? 'Just updated' : 'Not updated'}
          </SecondaryParagraph>
        </motion.div>
        <motion.div className="weatherColumn">
          <PrimaryParagraph>{props.weatherData.conditions.temperature} °C</PrimaryParagraph>
          <div className="weatherColumnWind">
            <SecondaryParagraph>{3.6 * props.weatherData.conditions.windSpeed} km/h,</SecondaryParagraph>
            <SecondaryParagraph>{props.weatherData.conditions.windDirection}°</SecondaryParagraph>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
