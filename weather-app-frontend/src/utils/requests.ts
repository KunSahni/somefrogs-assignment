export const getWeatherData = async (city: string) => {
  const response = await fetch(`http://localhost:3000/weather`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ place: city })
  })
  const result = await response.json()
  return result
}

export const getCities = async (searchTerm: string, pageSize: number, currentPage: number) => {
  const response = await fetch(`http://localhost:3000/cities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ searchTerm: searchTerm, pageSize: pageSize, currentPage: currentPage })
  })
  const result = await response.json()
  return result
}
