import { Request } from 'express'
import { ValidationError } from '../types'

export const validateGetWeatherRequest = (req: Request): void => {
  if (!req.body.place) throw new ValidationError('Invalid request - place is required. (error: 12430213)')
  if (typeof req.body.place !== 'string')
    throw new ValidationError('Invalid request - place must be a string. (error: 09812309)')
  if (req.body.place === '') throw new ValidationError('Invalid request - place must not be empty. (error: 12309812)')
}

export const validateGetPlacesRequest = (req: Request): void => {
  if (req.body.searchTerm && typeof req.body.searchTerm !== 'string')
    throw new ValidationError('Invalid request - searchTerm must be a string. (error: 23409812)')
  if (req.body.searchTerm && req.body.searchTerm === '')
    throw new ValidationError('Invalid request - searchTerm must not be empty. (error: 78230923)')

  if (req.body.pageSize === undefined || req.body.pageSize === null)
    throw new ValidationError('Invalid request - pageSize is required. (error: 68709132)')
  if (typeof req.body.pageSize !== 'number')
    throw new ValidationError('Invalid request - pageSize must be a number. (error: 34560982)')
  if (req.body.pageSize < 1)
    throw new ValidationError('Invalid request - pageSize must be greater than 0. (error: 86712902)')

  if (req.body.currentPage === undefined || req.body.currentPage === null)
    throw new ValidationError('Invalid request - currentPage is required. (error: 56780982)')
  if (typeof req.body.currentPage !== 'number')
    throw new ValidationError('Invalid request - currentPage must be a number. (error: 07904238)')
  if (req.body.currentPage < 0)
    throw new ValidationError('Invalid request - currentPage must be greater or equal than 0. (error: 89023127)')
}
