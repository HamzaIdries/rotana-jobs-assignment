const path = require('path');
const express = require('express');
const { extract } = require('@extractus/feed-extractor');
const fs = require('fs');
const {Client} = require("@googlemaps/google-maps-services-js");
const cors = require('cors');
require('dotenv').config();

const URL = "https://www.rotanacareers.com/live-bookmarks/all-rss.xml";
const publicPath = path.join(__dirname, 'build');
const client = new Client({});

async function geocodeAddress(address) {
   const response = await client.geocode({
      params: {
         key: process.env.REACT_APP_GOOGLE_MAP_KEY,
         address: address
      }
   });
   return response.data.results[0].geometry.location;
}

async function geocodeAllAddresses(addresses) {
   addresses = [...new Set(addresses.map(address => address))];
   const addressToLocation = {};
   addresses = addresses.map(async address => {
      return geocodeAddress(address)
         .then(location => addressToLocation[address] = location);
   });
   await Promise.all(addresses);
   return addressToLocation;
}

async function updateData() {
   console.log('Updating data...');
   const response = await extract(URL, {
      getExtraEntryFields: feedData => {
         const city = feedData.city;
         const country = feedData.country;
         return {
            location: city ? `${city}, ${country}` : country
         };
      }
   }
   );
   const addressToLocation = await geocodeAllAddresses(response.entries.map(entry => entry.location));
   const result = response.entries.map(entry => {
      return {
         title: entry.title,
         location: entry.location,
         latLng: addressToLocation[entry.location]
      };
   });
   fs.writeFile(
      path.join(publicPath, 'data.json'),
      JSON.stringify(result),
      () => console.log('Updated data successfully')
   );
}

updateData();
setInterval(updateData, 1000 * 60 * 30);

const app = express();
app.use(cors());
const port = process.env.PORT || 8080; 
app.use(express.static(publicPath));

app.get('*', (req, res) => {
   res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
   console.log('Server is up!');
});