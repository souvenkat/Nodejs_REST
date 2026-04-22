// Imports the relevant libraries
const express = require('express');
const xml2js = require('xml2js');


const app = express();

const port = 4000;

// Maps the specification codes to the demographic categories they represent
const map = {
  C06: "Luxembourgish Males",
  C05: "Luxembourgish Females",
  C01: "Total Population",
  C03: "Foreign Males",
  C04: "Foreign Females",
  C07: "Total Males",
  C08: "Total Females"
};


app.use(express.json());

// Handler for the HTTP GET method
app.get('/api/:year', async (req, res) => {

  // Stores the value of the year parameter of the URI
  const year = parseInt(req.params.year, 10);

  // If 'year' is not an integer, then an error message is sent
  if (isNaN(year)) {
    return res.status(400).json({ error: 'Invalid year parameter.' });
  }

  try {

    // Calls the 'fetchPopulationData' function
    const data = await fetchPopulationData(year);

    // If nothing is returned or the year returned is not equal to the year requested,
    // then the population data for the closest previous and next years are returned
    // in JSON format, if available
    if (!data || data.year !== year) {

      const previousYearData = await fetchClosestPreviousYear(year);
      const nextYearData = await fetchClosestNextYear(year);

      if (!previousYearData && !nextYearData) {
        return res.status(404).json({ error: `No data available for year ${year} or surrounding years.` });
      }

      return res.json({
        previousYear: previousYearData
          ? {
              year: previousYearData.year,
              data: previousYearData.data,
            }
          : null,
        nextYear: nextYearData
          ? {
              year: nextYearData.year,
              data: nextYearData.data,
            }
          : null,
      });
    }

    res.json({ year: data.year, population: data.population });
  } catch (error) {
    
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Returns Luxembourg population data for the 'year' specified using the Statec Developer API
async function fetchPopulationData(year) {

  const apiUrl = `https://lustat.statec.lu/rest/data/LU1,DF_B1100,1.0/C08+C07+C06+C05+C04+C03+C01.A?endPeriod=${year}&lastNObservations=1`;
  const response = await fetch(apiUrl);

  const xmlData = await response.text();

  // Parser created
  const parser = new xml2js.Parser({ explicitArray: false });

  // Parses the XML data to JSON
  const jsonData = await parser.parseStringPromise(xmlData);

  // Extracts the series of population data from the parsed JSON object.
  const series = jsonData?.["message:GenericData"]?.["message:DataSet"]?.["generic:Series"];

  // Parses the year from the series of data
  const returnedYear = parseInt(series[0]?.["generic:Obs"]?.["generic:ObsDimension"]?.["$"]?.["value"]?.split('-')[0], 10);

  // Calls the 'processPopulationData' function
  const data = processPopulationData(jsonData);

  return { year: returnedYear, population: data.population };
}

// Returns the closest previous year for which data exists or null if it doesn't
async function fetchClosestPreviousYear(year) {

  let yearBefore = year - 1;

  // Loops until either a year with data is found or 1821 (which is the earliest year for which data exists)
  while (yearBefore > 1821) {
    const data = await fetchPopulationData(yearBefore);
    if (data) {
      return { year: yearBefore, data: data.population };
    }
    yearBefore--;
  }
  return null
}


// Returns the closest next year for which data exists or null if it doesn't
async function fetchClosestNextYear(year) {
  let yearAfter = year + 1;

  const currentYear = new Date().getFullYear();

  // Loops until either a year with data is found or 'currentYear'
  while (yearAfter <= currentYear) {
    const data = await fetchPopulationData(yearAfter);
    if (data) {
      return { year: yearAfter, data: data.population };
    }
    yearAfter++;
  }
  return null
}


// Extracts and organizes the population data into a structured format for each demographic category, if available
function processPopulationData(data) {
  const series = data["message:GenericData"]["message:DataSet"]["generic:Series"];
  if (!Array.isArray(series)) {
    return null
  }

  // Extracts the year from the first series item by navigating through the JSON structure.
  const year = series[0]?.["generic:Obs"]?.["generic:ObsDimension"]?.["$"]?.["value"]?.split('-')[0];

  // Reduces the series array into an object where each key is a demographic category
  // and its value is the corresponding population count.
  const populationData = series.reduce((result, item) => {
    const specification = item["generic:SeriesKey"]["generic:Value"].find((key) => key["$"]["id"] === "SPECIFICATION")?.["$"]?.["value"];
    const rawValue = item["generic:Obs"]?.["generic:ObsValue"]?.["$"]?.["value"];

    const value = rawValue && !isNaN(rawValue) ? parseInt(rawValue, 10) : null;
    const specificationName = map[specification] || specification;

    result[specificationName] = value;
    return result;
  }, {});

  return { year, population:  populationData };
}


// Starts the server and listens for incoming HTTP requests on the port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/api/`);
});
