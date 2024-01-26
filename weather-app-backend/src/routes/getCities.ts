import { parse } from 'csv-parse'
import fs from 'fs'
import path from 'path'
import { City, GetCitiesResponse } from '../types'

const parseCSVFile = (csvFilePath: string): Promise<City[] | undefined> => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(csvFilePath)

    const csvParser = parse({
      delimiter: ';',
      columns: true,
      skip_empty_lines: true
    })

    const data: City[] = []

    fileStream
      .pipe(csvParser)
      .on('data', (row) => {
        data.push({
          name: row['city'],
          lat: Number(row['lat']),
          lng: Number(row['lng']),
          region: row['region'],
          population: row['population'] ? Number(row['population']) : undefined
        })
      })
      .on('end', () => {
        resolve(data)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

export const getCities = async (req: {
  searchTerm: string | undefined
  pageSize: number
  currentPage: number
}): Promise<GetCitiesResponse> => {
  const cities: City[] | undefined = await parseCSVFile(path.resolve(__dirname, '../fi.csv'))
  if (!cities)
    return {
      status: 500,
      message: 'Internal server error',
      data: undefined
    }
  cities.sort((a, b) => a.name.localeCompare(b.name))
  if (req.searchTerm) {
    const filteredCities = cities.filter((city) => city.name.toLowerCase().includes(req.searchTerm!.toLowerCase()))
    return {
      status: 200,
      message: 'Success',
      data: {
        cities: filteredCities
          .slice(req.pageSize * req.currentPage, req.pageSize * (req.currentPage + 1))
          .map((city) => city.name)
      }
    }
  }
  return {
    status: 200,
    message: 'Success',
    data: {
      cities: cities
        .slice(req.pageSize * req.currentPage, req.pageSize * (req.currentPage + 1))
        .map((city) => city.name)
    }
  }
}
