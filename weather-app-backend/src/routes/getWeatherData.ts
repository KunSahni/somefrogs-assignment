import dotenv from 'dotenv'
import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { BadRequestError, GetWeatherDataResponseData, InternalServerError } from '../types'

dotenv.config()
const OPEN_DATA_QUERY_URL = process.env.OPEN_DATA_QUERY_URL || undefined

const roundToTwoDecimals = (num: number | undefined): number | undefined => {
  return Math.round((num ?? 0) * 100) / 100
}

export const getWeatherData = async (place: string): Promise<GetWeatherDataResponseData> => {
  if (!OPEN_DATA_QUERY_URL) throw new InternalServerError('Failed to read from .env file')

  const endTime = new Date()
  const startTime = new Date(endTime.getTime() - 30 * 60 * 1000)
  const response = await fetch(
    `${OPEN_DATA_QUERY_URL}&place=${place}&timestep=10&starttime=${startTime.toISOString()}&endtime=${endTime.toISOString()}`
  )
  if (response.status !== 200) throw new InternalServerError('Failed to fetch data from api')

  const xml = await response.text()
  if (XMLValidator.validate(xml) !== true) throw new InternalServerError('Failed to parse data received from api')

  const parsedXMl = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, attributeNamePrefix: '@_' }).parse(
    xml
  )
  const timeValuesMap = new Map<
    string,
    { temperature: number | undefined; windSpeedMs: number | undefined; windDirection: number | undefined }
  >()

  if (!parsedXMl['FeatureCollection']['member']) throw new BadRequestError('The place you entered was not found')

  parsedXMl['FeatureCollection']['member']
    .filter((member: any) => {
      return (
        member['PointTimeSeriesObservation']['observedProperty']['@_href'].includes('param=t2m') ||
        member['PointTimeSeriesObservation']['observedProperty']['@_href'].includes('param=ws_10min') ||
        member['PointTimeSeriesObservation']['observedProperty']['@_href'].includes('param=wd_10min')
      )
    })
    .map((member: any) => {
      let type = ''
      if (member['PointTimeSeriesObservation']['observedProperty']['@_href'].includes('param=t2m')) {
        type = 'temperature'
      } else if (member['PointTimeSeriesObservation']['observedProperty']['@_href'].includes('param=ws_10min')) {
        type = 'windSpeedMs'
      } else if (member['PointTimeSeriesObservation']['observedProperty']['@_href'].includes('param=wd_10min')) {
        type = 'windDirection'
      }
      const timeValuePairs = member['PointTimeSeriesObservation']['result']['MeasurementTimeseries']['point'].map(
        (point: any) => {
          return {
            timestamp: point['MeasurementTVP']['time'],
            value: Number(point['MeasurementTVP']['value']) ?? undefined
          }
        }
      )
      return {
        type: type,
        content: timeValuePairs
      }
    })
    .forEach((member: { type: string; content: { timestamp: string; value: number | undefined }[] }) => {
      member.content.forEach((content: { timestamp: string; value: number | undefined }) => {
        const mapEntry = timeValuesMap.get(content.timestamp)
        if (!mapEntry) {
          timeValuesMap.set(content.timestamp, {
            temperature: member.type === 'temperature' ? content.value : undefined,
            windSpeedMs: member.type === 'windSpeedMs' ? content.value : undefined,
            windDirection: member.type === 'windDirection' ? content.value : undefined
          })
          return
        }
        timeValuesMap.set(content.timestamp, {
          temperature: member.type === 'temperature' ? content.value : mapEntry.temperature,
          windSpeedMs: member.type === 'windSpeedMs' ? content.value : mapEntry.windSpeedMs,
          windDirection: member.type === 'windDirection' ? content.value : mapEntry.windDirection
        })
      })
    })

  const mostRecentValidTimestamp = Array.from(timeValuesMap.keys()).reduce((a, b) => {
    const aValues = timeValuesMap.get(a)
    const bValues = timeValuesMap.get(b)
    const numberOfValidValuesA =
      (aValues?.temperature ? 1 : 0) + (aValues?.windSpeedMs ? 1 : 0) + (aValues?.windDirection ? 1 : 0)
    const numberOfValidValuesB =
      (bValues?.temperature ? 1 : 0) + (bValues?.windSpeedMs ? 1 : 0) + (bValues?.windDirection ? 1 : 0)
    if (numberOfValidValuesA === numberOfValidValuesB) {
      return new Date(a) > new Date(b) ? a : b
    } else {
      return numberOfValidValuesA > numberOfValidValuesB ? a : b
    }
  })

  const mostRecentMapEntry = timeValuesMap.get(mostRecentValidTimestamp)
  if (!mostRecentMapEntry)
    throw new InternalServerError('Unable to retrieve recent weather data, please try again later')

  return {
    data: {
      timestamp: mostRecentValidTimestamp,
      temperature: roundToTwoDecimals(mostRecentMapEntry.temperature) ?? undefined,
      windSpeed: roundToTwoDecimals(3.6 * (mostRecentMapEntry.windSpeedMs ?? 0)) ?? undefined,
      windDirection: roundToTwoDecimals(mostRecentMapEntry.windDirection) ?? undefined
    }
  }
}
