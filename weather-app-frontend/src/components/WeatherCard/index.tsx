import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { WeatherData } from '../../types'
import { PrimaryParagraph, SecondaryParagraph } from '../Text'
import './style.scss'

interface WeatherCardProps {
  weatherData: WeatherData
  testId?: string
}

export const WeatherCard = (props: WeatherCardProps) => {
  const [timestampMessage, setTimestampMessage] = useState<string>('')
  const [windExplanationMessage, setWindExplanationMessage] = useState<string>('')

  const getWindConditionsString = (windSpeed: number | undefined, windDirection: number | undefined) => {
    if (windSpeed === undefined && windDirection === undefined) return 'N/A'
    if (windSpeed === undefined) return windDirection + '°'
    if (windDirection === undefined) return windSpeed + ' km/h'
    return windSpeed + ' km/h, ' + windDirection + '°'
  }

  useEffect(() => {
    if (!props.weatherData.conditions?.timestamp) return
    const timestamp = new Date(props.weatherData.conditions.timestamp)
    setTimestampMessage(
      'Updated at ' +
        timestamp.getHours().toString().padStart(2, '0') +
        ':' +
        timestamp.getMinutes().toString().padStart(2, '0')
    )
  }, [props.weatherData.conditions?.timestamp])

  useEffect(() => {
    if (props.weatherData.conditions?.windSpeed === undefined || props.weatherData.conditions?.windSpeed === null) {
      setWindExplanationMessage('')
      return
    }
    if (props.weatherData.conditions.windSpeed <= 1) setWindExplanationMessage('Calm')
    else if (props.weatherData.conditions.windSpeed < 6) setWindExplanationMessage('Light air')
    else if (props.weatherData.conditions.windSpeed < 12) setWindExplanationMessage('Light breeze')
    else if (props.weatherData.conditions.windSpeed < 20) setWindExplanationMessage('Gentle breeze')
    else if (props.weatherData.conditions.windSpeed < 30) setWindExplanationMessage('Moderate breeze')
    else if (props.weatherData.conditions.windSpeed < 40) setWindExplanationMessage('Fresh breeze')
    else if (props.weatherData.conditions.windSpeed < 50) setWindExplanationMessage('Strong breeze')
    else if (props.weatherData.conditions.windSpeed < 62) setWindExplanationMessage('Near gale')
    else if (props.weatherData.conditions.windSpeed < 75) setWindExplanationMessage('Gale')
    else if (props.weatherData.conditions.windSpeed < 89) setWindExplanationMessage('Strong gale')
    else if (props.weatherData.conditions.windSpeed < 103) setWindExplanationMessage('Storm')
    else if (props.weatherData.conditions.windSpeed < 118) setWindExplanationMessage('Violent storm')
    else setWindExplanationMessage('Hurricane')
  }, [props.weatherData.conditions?.windSpeed])

  return (
    <AnimatePresence>
      <motion.div className="weatherCard" data-test-id={props.testId}>
        <video src="/videos/backgroundVideo.mp4" className="backgroundVideo" autoPlay muted loop />
        <motion.div className="infoColumn">
          <PrimaryParagraph style={{ fontWeight: '600' }}>{props.weatherData.city}</PrimaryParagraph>
          <SecondaryParagraph>{props.weatherData.region}</SecondaryParagraph>
          <SecondaryParagraph style={{ marginTop: 'auto' }}>{timestampMessage}</SecondaryParagraph>
        </motion.div>
        <motion.div className="weatherColumn">
          <PrimaryParagraph>{props.weatherData.conditions?.temperature + '°C' ?? 'N/A'}</PrimaryParagraph>
          <div className="weatherColumnWind">
            <SecondaryParagraph>{windExplanationMessage}</SecondaryParagraph>
            <SecondaryParagraph>
              {getWindConditionsString(
                props.weatherData.conditions?.windSpeed,
                props.weatherData.conditions?.windDirection
              )}
            </SecondaryParagraph>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
