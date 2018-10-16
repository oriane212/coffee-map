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

    let locations = []; //let locations = [[-74.02, 40.77], [-73.2, 41.5]];

    // create geocoding client
    const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

    // geocode location
    // TODO: handle more than one location (handle more than one promise)
    geocodingClient.forwardGeocode({
      query: 'New York, NY',
      limit: 2
    })
      .send()
      .then(response => {
        const match = response.body;
        locations.push(match.features[0].center);
        // update state with geocoded locations
        this.setState({
          locations_geocoded: locations
        })
        // create and add a marker for each location to the map
        this.state.locations_geocoded.forEach((location) => {
          new mapboxgl.Marker().setLngLat(location).addTo(map);
        });

      });
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
