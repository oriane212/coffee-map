import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
//var mbxGeocoding = require('@mapbox/mapbox-gl-geocoder');

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: -74.0226071,
      lat: 40.7786204,
      zoom: 9.5,
      locations_geocoded: []
    };
  }

  componentDidMount() {

    // get current values stored in state
    const { lng, lat, zoom } = this.state;

    // initialize map object
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [lng, lat],
      zoom
    });

    // coffee places
    const coffeePlaces = [
      {
        name: 'Madman Espresso',
        type: 'cafe',
        address: '54 University Pl, New York, NY 10003'
      },
      {
        name: 'Allendale Eats',
        type: 'diner',
        address: '101 w allendale ave, allendale, new jersey 07401'
      }
    ]

    // create empty feature collection
    const geojson = {
      type: 'FeatureCollection',
      features: []
    };

    // create geocoding client
    const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

    // forward geocode each coffee place address
    coffeePlaces.forEach((place) => {
      geocodingClient.forwardGeocode({
        query: place.address,
        limit: 1
      })
        .send()
        .then(response => {
          // store feature object
          const feature = response.body.features[0];
          // add title and description properties
          feature.properties = {
            title: place.name,
                  description: place.type
          }
          // push feature object to feature collection
          geojson.features.push(feature);

          // TODO: handle more than one promise before setting state?
          // TODO: move to componentDidUpdate?

          // update state with geocoded locations
          this.setState({
            locations_geocoded: geojson.features
          })
          // create and add a marker for each location to the map
          this.state.locations_geocoded.forEach((location) => {
            new mapboxgl.Marker()
              .setLngLat(location.geometry.coordinates)
              .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h3>${location.properties.title}</h3><p>${location.properties.description}</p>`))
              .addTo(map);
          });

        });
    })
  }

  render() {
    /* ref instead of id? */
    return (
      <div>
        <div id="map"></div>
      </div>

    );
  }
}

export default App;
