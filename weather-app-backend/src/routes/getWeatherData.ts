import { GetWeatherDataResponse } from '../types'
import dotenv from 'dotenv'
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

dotenv.config()
const OPEN_DATA_QUERY_URL = process.env.OPEN_DATA_QUERY_URL || undefined

export const getWeatherData = async (place: string): Promise<GetWeatherDataResponse> => {
  if (!OPEN_DATA_QUERY_URL)
    return {
      status: 500,
      message: 'Internal server error',
      data: undefined
    }

  const endTime = new Date()
  const startTime = new Date(endTime.getTime() - 30 * 60 * 1000)
  const response = await fetch(
    `${OPEN_DATA_QUERY_URL}&place=${place}&starttime=${startTime.toISOString()}&endtime=${endTime.toISOString()}`
  )
  if (response.status !== 200)
    return {
      status: response.status,
      message: response.statusText,
      data: undefined
    }

  const xml = await response.text()
  if (XMLValidator.validate(xml) !== true)
    return {
      status: 500,
      message: 'Internal server error',
      data: undefined
    }

  const parsedXMl = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' }).parse(xml)
  const temperatures = parsedXMl['wfs:FeatureCollection']['wfs:member']
    .filter((member: any) => {
      return member['omso:PointTimeSeriesObservation']['om:observedProperty']['@_xlink:href'].includes('param=t2m')
    })
    .map((member: any) => {
      return member['omso:PointTimeSeriesObservation']['om:result']['wml2:MeasurementTimeseries']['wml2:point']
    })
    .flat()
    .map((member: any) => {
      return {
        timestamp: new Date(member['wml2:MeasurementTVP']['wml2:time']),
        value: Number(member['wml2:MeasurementTVP']['wml2:value'])
      }
    })
    .sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime())

  const windSpeeds = parsedXMl['wfs:FeatureCollection']['wfs:member']
    .filter((member: any) => {
      return member['omso:PointTimeSeriesObservation']['om:observedProperty']['@_xlink:href'].includes('param=ws_10min')
    })
    .map((member: any) => {
      return member['omso:PointTimeSeriesObservation']['om:result']['wml2:MeasurementTimeseries']['wml2:point']
    })
    .flat()
    .map((member: any) => {
      return {
        timestamp: new Date(member['wml2:MeasurementTVP']['wml2:time']),
        value: Number(member['wml2:MeasurementTVP']['wml2:value'])
      }
    })
    .sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime())

  const windDirections = parsedXMl['wfs:FeatureCollection']['wfs:member']
    .filter((member: any) => {
      return member['omso:PointTimeSeriesObservation']['om:observedProperty']['@_xlink:href'].includes('param=wd_10min')
    })
    .map((member: any) => {
      return member['omso:PointTimeSeriesObservation']['om:result']['wml2:MeasurementTimeseries']['wml2:point']
    })
    .flat()
    .map((member: any) => {
      return {
        timestamp: new Date(member['wml2:MeasurementTVP']['wml2:time']),
        value: Number(member['wml2:MeasurementTVP']['wml2:value'])
      }
    })
    .sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime())

  console.log(temperatures)
  console.log(windSpeeds)
  console.log(windDirections)

  return {
    status: 200,
    message: 'Success',
    data: {
      timestamp: temperatures[0].timestamp.toISOString(),
      temperature: temperatures[0].value,
      windSpeed: windSpeeds[0].value,
      windDirection: windDirections[0].value
    }
  }
}
