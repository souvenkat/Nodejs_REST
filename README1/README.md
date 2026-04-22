# REST Web Service with Node.js

This project provides a RESTful web service using Node.js, Express, and the `xml2js` library to fetch population data for Luxembourg from the Statec website: <https://lustat.statec.lu/vis?fs[0]=Topics%2C1%7CPopulation%20and%20employment%23B%23%7CPopulation%20structure%23B1%23&pg=0&fc=Topics&lc=en&df[ds]=ds-release&df[id]=DF_B1100&df[ag]=LU1&df[vs]=1.0&pd=%2C1821&dq=C08%2BC07%2BC06%2BC05%2BC04%2BC01.A&vw=tb&lo=1/>.

The service fetches data from the Luxembourg statistics API using the following endpoint: `https://lustat.statec.lu/rest/data/LU1,DF_B1100,1.0/`



## Prerequisites

* Install Node.js and npm.

* Ensure internet access to fetch data from the external API.



## Setup

* Install dependencies using the following command: 

`npm install`



## Starting the Server

* Run the following command to start the server: 

`node app.js`

* The service will be available at: <http://localhost:4000/>



## API Endpoints

### Fetch Population Data

Endpoint: /api/:year
Method: GET

Fetches population data for the specified year. 

If data for the exact year is unavailable, the service returns data for the closest previous and/or next years.


#### Example Request

<http://localhost:4000/api/1827>


#### Example Responses

When data for the requested year is unavailable, but data for nearby years is available:

```
{
  "previousYear": {
    "year": 1826,
    "data": {
      "Luxembourgish Males": null,
      "Luxembourgish Females": null,
      "Total Population": 134082,
      "Foreign Males": null,
      "Foreign Females": null,
      "Total Males": null,
      "Total Females": null
    }
  },
  "nextYear": {
    "year": 1828,
    "data": {
      "Luxembourgish Males": null,
      "Luxembourgish Females": null,
      "Total Population": 134082,
      "Foreign Males": null,
      "Foreign Females": null,
      "Total Males": null,
      "Total Females": null
    }
  }
}
```

When no data is available for the requested year or surrounding years:

```
{
  "error": "No data available for year 1827 or surrounding years."
}
```


### Error Handling

Invalid year parameter:

```
{
  "error": "Invalid year parameter."
}
```


No data found for the requested year or surrounding years:

```
{
  "error": "No data available for year 1827 or surrounding years."
}
```




