import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Place, WeatherConditions } from '../../utils/types'
import { getWeatherData } from '../../utils/requests'
import { PrimaryParagraph, SecondaryParagraph } from '../Text'
import './style.scss'

interface WeatherCardProps {
  place: Place
  inViewCallback?: () => void
  ariaRole?: string
  testId?: string
}

export const WeatherCard = (props: WeatherCardProps) => {
  const ref = useRef(null)
  const [timestampMessage, setTimestampMessage] = useState<string>('')
  const [windExplanationMessage, setWindExplanationMessage] = useState<string>('')
  const [weatherConditions, setWeatherConditions] = useState<WeatherConditions | undefined>(undefined)
  const isInView = useInView(ref)

  const getWindConditionsString = (windSpeed: number | undefined, windDirection: number | undefined) => {
    ;``
    if (windSpeed === undefined && windDirection === undefined) return 'N/A'
    if (windSpeed === undefined) return windDirection + '°(' + degreesToCardinal(windDirection!) + ')'
    if (windDirection === undefined) return windSpeed + ' km/h'
    return windSpeed + ' km/h, ' + windDirection + '°(' + degreesToCardinal(windDirection) + ')'
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

  // GPT-3.5 generated function
  const windSpeedToVelocityMapping = (x: number): number => {
    // Define the mapping parameters
    const mappingPoints: { x: number; y: number }[] = [
      { x: 1, y: 15 },
      { x: 5, y: 12 },
      { x: 15, y: 10 }
      // Add more mapping points as needed
    ]

    // Sort the mapping points based on x values
    const sortedMappingPoints = mappingPoints.sort((a, b) => a.x - b.x)

    // Find the two nearest mapping points
    let startPoint = sortedMappingPoints[0]
    let endPoint = sortedMappingPoints[1]

    // If x is less than the smallest mapped x value, use the first mapping point
    if (x <= startPoint.x) {
      return startPoint.y
    }

    // If x is greater than the largest mapped x value, use the last mapping point
    if (x >= endPoint.x) {
      return endPoint.y
    }

    // Calculate the slope (m) and y-intercept (b)
    const m = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x)
    const b = startPoint.y - m * startPoint.x

    // Apply the linear mapping formula
    const y = m * x + b

    return y
  }

  // GPT-3.5 generated function
  const degreesToCardinal = (angle: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N']

    // Make sure the angle is within the range [0, 360)
    angle = ((angle % 360) + 360) % 360

    // Calculate the index based on the angle
    const index = Math.round((angle % 360) / 45)

    return directions[index]
  }

  const getCardStyle = () => {
    if (!weatherConditions) return {}
    const hour = new Date('2024-01-27T20:55:44.083Z').getHours()
    const direction = weatherConditions.windDirection ?? 0
    let gradient

    if (hour >= 6 && hour < 9) {
      // Morning Sky
      gradient = `linear-gradient(${direction}deg, #75b0c7, #add8e6)`
    } else if (hour >= 9 && hour < 16) {
      // Day Sky
      gradient = `linear-gradient(${direction}deg, #add8e6, #539fbd)`
    } else if (hour >= 16 && hour < 18) {
      // Sunset Sky
      gradient = `linear-gradient(${direction}deg, #ffa265, #ff6b43)`
    } else if (hour >= 18 && hour < 20) {
      // Evening Sky
      gradient = `linear-gradient(${direction}deg, #ff6b43, #162c52)`
    } else if (hour >= 20 && hour < 22) {
      // Dawn Sky
      gradient = `linear-gradient(${direction}deg, #162c52, #40464f)`
    } else {
      // Night Sky
      gradient = `linear-gradient(${direction}deg, #0a1c3c, #3e3f40)`
    }

    return {
      background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), ${gradient}`,
      backgroundSize: '400% 400%',
      animation: `gradientAnimation ${windSpeedToVelocityMapping(weatherConditions.windSpeed ?? 1)}s ease infinite`
    }
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
    if (props.inViewCallback) props.inViewCallback()
    fetchUpdatedWeatherConditions()
  }, [isInView])

  return (
    <AnimatePresence>
      <motion.div
        className="weatherCard"
        data-test-id={props.testId}
        ref={ref}
        style={getCardStyle()}
        role={props.ariaRole}
      >
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
