# somefrogs assignment

This is my personal submission for the fullstack takehome assignment from some frogs.

The repo contains both frontend and backend, furthermore it contains a docker compose to make it even easier to run.

## Assignment requirement

- App shows the latest measured temperature, wind speed and direction for all the cities in Finland
- Search field at top of the page to filter cities, by default, all cities are visible
- Cities are shown in an alphabetically ordered scrollable list and displays at most 10 cities on the screen a time
- Data should be fetched for a given city only when it's visible on the screnn (viewport)
- App should be fast and display content asap
- Cache data to avoid useless calls and improve overall performance
- App should feel interactive, with modern UX, and the scrolling should be smooth
- Should work on different screen sizes nicely
- Filtering of cities should work very fast

## How to run the project

- Make sure to have Docker installed, run `docker -v` to check
- If docker is not installed please install it from [here](https://docs.docker.com/engine/install/)
- Run `docker-compose build` from the root folder
- You should be able to start the project by running `docker-compose up` from the root folder
- If everything went correctly you should now have the HTTP server running on `localhosto:3000/` and frontent on `localhosto:4173/`

## API specification

The HTTP server contains only two endpoints, both use POST. You can test them locally as well by running the project and sending requests to `localhost:3000/` from Postman or Insomnia.

### /places

Returns an array of tuples where each tuple contains a city and its region. The parameters are as follow:
-  `searchTerm`: text to filter on - string, optional
-  `pageSize`: size of the page (how many places you want the endpoint to return) - number, <strong>required</strong>
-  `currentPage`: number of the current page - number, <strong>required</strong>

Here are some examples on how the request body should look like:
```javascript
// Valid request body
{ 
	"searchTerm": "Hel",
	"pageSize": 10,
	"currentPage: 0
}

// Valid request body
{ 
	"pageSize": 10,
	"currentPage: 0
}

// Invalid request body
{ 
	"searchTerm": "Hel",
	"pageSize": "10",
	"currentPage: "0"
}

// Invalid request body
{ 
	"searchTerm": "Hel",
	"pageSize": 10,
}
```

The responses are formatted like this:

```javascript
// Success
{
	"status": 200,
	"data": {
		"places": [
			{
				"city": "Helsinki",
				"region": "Uusimaa"
			},
      ...
		]
	}
}

// Failure
{
	"status": 400,
	"message": "Invalid request - currentPage is required. (error: 56780982)"
}
```

### /weather

Returns the most recent weather conditions for a given place. The parameters are as follow:
-  `place`: name of the city - string, <strong>required</strong>

Here are some examples on how the request body should look like:
```javascript
// Valid request body
{
 "place": "Helsinki"
}

// Invalid request body
{ 
  "place": "H"
}
```

The responses are formatted like this:

```javascript
// Success
{
  "status": 200,
	"data": {
		"timestamp": "2024-01-28T11:30:00Z",
		"temperature": 2.1,
		"windSpeed": 12.96,
		"windDirection": 241
	}
}

// Failure
{
	"status": 400,
	"message": "The place you entered was not found. (error: 56489123)"
}
```