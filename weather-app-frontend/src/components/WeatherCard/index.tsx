import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Place, WeatherConditions } from '../../types'
import { getWeatherData } from '../../utils/requests'
import { PrimaryParagraph, SecondaryParagraph } from '../Text'
import './style.scss'

interface WeatherCardProps {
  place: Place
  testId?: string
}

export const WeatherCard = (props: WeatherCardProps) => {
  const ref = useRef(null)
  const [timestampMessage, setTimestampMessage] = useState<string>('')
  const [windExplanationMessage, setWindExplanationMessage] = useState<string>('')
  const [weatherConditions, setWeatherConditions] = useState<WeatherConditions | undefined>(undefined)
  const isInView = useInView(ref)

  const getWindConditionsString = (windSpeed: number | undefined, windDirection: number | undefined) => {
    if (windSpeed === undefined && windDirection === undefined) return 'N/A'
    if (windSpeed === undefined) return windDirection + '°'
    if (windDirection === undefined) return windSpeed + ' km/h'
    return windSpeed + ' km/h, ' + windDirection + '°'
  }

  const fetchUpdatedWeatherConditions = async () => {
    const updatedConditions = await getWeatherData(props.place.city)
    setWeatherConditions({
      temperature: updatedConditions?.temperature,
      windSpeed: updatedConditions?.windSpeed,
      windDirection: updatedConditions?.windDirection,
      timestamp: updatedConditions?.timestamp
    } as WeatherConditions)
  }

  useEffect(() => {
    if (!weatherConditions?.timestamp) return
    const timestamp = new Date(weatherConditions.timestamp)
    setTimestampMessage(
      'Updated at ' +
        timestamp.getHours().toString().padStart(2, '0') +
        ':' +
        timestamp.getMinutes().toString().padStart(2, '0')
    )
  }, [weatherConditions?.timestamp])

  useEffect(() => {
    if (weatherConditions?.windSpeed === undefined || weatherConditions?.windSpeed === null) {
      setWindExplanationMessage('')
      return
    }
    if (weatherConditions.windSpeed <= 1) setWindExplanationMessage('Calm')
    else if (weatherConditions.windSpeed < 6) setWindExplanationMessage('Light air')
    else if (weatherConditions.windSpeed < 12) setWindExplanationMessage('Light breeze')
    else if (weatherConditions.windSpeed < 20) setWindExplanationMessage('Gentle breeze')
    else if (weatherConditions.windSpeed < 30) setWindExplanationMessage('Moderate breeze')
    else if (weatherConditions.windSpeed < 40) setWindExplanationMessage('Fresh breeze')
    else if (weatherConditions.windSpeed < 50) setWindExplanationMessage('Strong breeze')
    else if (weatherConditions.windSpeed < 62) setWindExplanationMessage('Near gale')
    else if (weatherConditions.windSpeed < 75) setWindExplanationMessage('Gale')
    else if (weatherConditions.windSpeed < 89) setWindExplanationMessage('Strong gale')
    else if (weatherConditions.windSpeed < 103) setWindExplanationMessage('Storm')
    else if (weatherConditions.windSpeed < 118) setWindExplanationMessage('Violent storm')
    else setWindExplanationMessage('Hurricane')
  }, [weatherConditions?.windSpeed])

  useEffect(() => {
    if (!isInView) return
    fetchUpdatedWeatherConditions()
  }, [isInView])

  return (
    <AnimatePresence>
      <motion.div className="weatherCard" data-test-id={props.testId} ref={ref}>
        <video src="/videos/backgroundVideo.mp4" className="backgroundVideo" autoPlay muted loop />
        <motion.div className="infoColumn">
          <PrimaryParagraph style={{ fontWeight: '600' }}>{props.place.city}</PrimaryParagraph>
          <SecondaryParagraph>{props.place.region}</SecondaryParagraph>
          <SecondaryParagraph style={{ marginTop: 'auto' }}>{timestampMessage}</SecondaryParagraph>
        </motion.div>
        <motion.div className="weatherColumn">
          <PrimaryParagraph>
            {weatherConditions?.temperature ? weatherConditions?.temperature + '°C' : 'N/A'}
          </PrimaryParagraph>
          <div className="weatherColumnWind">
            <SecondaryParagraph>{windExplanationMessage}</SecondaryParagraph>
            <SecondaryParagraph>
              {getWindConditionsString(weatherConditions?.windSpeed, weatherConditions?.windDirection)}
            </SecondaryParagraph>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
