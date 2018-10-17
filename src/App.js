import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as CoffeePlaces from './CoffeePlaces';
import List from './List';
//var mbxGeocoding = require('@mapbox/mapbox-gl-geocoder');

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: -74.0226071,
      lat: 40.7786204,
      // TODO: zoom out further for smaller screen (use mapbox property expression?)
      zoom: 9.5,
      items: ''
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

    // create empty feature collection
    let geojson = {
      type: 'FeatureCollection',
      features: []
    };

    // create geocoding client
    const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

    // forward geocode each coffee place address
    CoffeePlaces.coffeePlaces.forEach((place) => {
      geocodingClient.forwardGeocode({
        query: place.address,
        limit: 1
      })
        .send()
        .then(response => {
          if (response != null && response.error == null) {
            // store feature object
            const feature = response.body.features[0];
            console.log(feature);
            // add title and description properties
            feature.properties = {
              title: place.name,
              description: place.type
            }
            // push feature object to feature collection
            geojson.features.push(feature);

            this.setState({
              items: geojson
            })

          } else {
            return ;
          }

          
          // create and add a marker for each location to the map
          geojson.features.forEach((location) => {
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
        <div className='sidebar pad2'>
          <List items={ this.state.items.length !== 0 ? this.state.items : '' }></List>
        </div>
      </div>

    );
  }
}

export default App;
