
Coffee Map
===============================
Map of places visited in Comedians in Cars Getting Coffee

[View the app!](https://comedians-in-cars-coffee-map.herokuapp.com/)

![demo of filtering and selecting venues](coffeeMap.gif)

## Dependencies
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). All `src` and `public` files are needed to run this app (do not move files between folders). 
This app relies on:
- Mapbox SDK for geocoding addresses and Mapbox GL JS for rendering a map of venues
- Foursquare's Places API for fetching detailed venue information using a Client ID and Client Secret from a developer account
- React Font Awesome icons

## Using a Foursquare Developer account for this project
A Personal account (which allows 500 "premium" calls/day) is best for handling the volume of API calls necessary to run the app smoothly. The Personal account is free but requires a credit card to verify your identity. You can get a developer account at https://foursquare.com/developers/signup. 

## How to run the app
1. Clone this repo.
2. Install dependencies with `npm install`.
3. Copy and paste your Foursquare developer Client ID and Client Secret to the `ClIENT_ID` and `CLIENT_SECRET` variables in `src/App.js`.

### Development mode
4. Launch the app with `npm start`.

### Production mode for offline use
The app needs to be in production mode to enable the service worker. For more details: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app.

4. Build the app with `npm run build`.
5. Start a static server with `serve -s build`.
6. Launch by typing the provided local host URL (eg. `http://localhost:5000`) in the browser.
