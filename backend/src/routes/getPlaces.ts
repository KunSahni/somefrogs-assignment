import { createCache, memoryStore } from 'cache-manager'
import { parse } from 'csv-parse'
import fs from 'fs'
import path from 'path'
import { GetPlacesResponseData, InternalServerError, Place } from '../types'

const cacheMem = createCache(memoryStore(), {
  max: 100,
  ttl: 10 * 60 * 1000 /*milliseconds*/
})

const parseCSVFile = (csvFilePath: string): Promise<Place[] | undefined> => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(csvFilePath)

    const csvParser = parse({
      delimiter: ';',
      columns: true,
      skip_empty_lines: true
    })

    const data: Place[] = []

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

export const getPlaces = async (req: {
  searchTerm: string | undefined
  pageSize: number
  currentPage: number
}): Promise<GetPlacesResponseData> => {
  const cachedResponse = await cacheMem.get(
    'places' + '_' + req.searchTerm?.toLowerCase() + '_' + req.pageSize + '_' + req.currentPage
  )
  if (cachedResponse) return cachedResponse as GetPlacesResponseData

  const places: Place[] | undefined = await parseCSVFile(path.resolve(__dirname, '../files/fi.csv'))
  if (!places) throw new InternalServerError('Could not read places from csv file')
  places.sort((a, b) => a.name.localeCompare(b.name, 'fi'))

  let filteredPlaces: Place[] | undefined = req.searchTerm
    ? places.filter((city) => city.name.toLowerCase().includes(req.searchTerm!.toLowerCase()))
    : undefined

  const result: GetPlacesResponseData = {
    data: {
      places: (filteredPlaces ?? places)
        .slice(req.pageSize * req.currentPage, req.pageSize * (req.currentPage + 1))
        .map((city) => {
          return { city: city.name, region: city.region }
        })
    }
  }
  await cacheMem.set(
    'places' + '_' + req.searchTerm?.toLowerCase() + '_' + req.pageSize + '_' + req.currentPage,
    result
  )
  return result
}
