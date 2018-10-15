import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      lng: -74.0226071,
      lat: 40.7786204,
      zoom: 9.5
    };
  }
  
  componentDidMount() {
    // get current values stored in state
    const { lng, lat, zoom } = this.state;

    // initialize map object
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom
    });

  }

  render() {
    /* ref instead of id? */
    return (
      <div id="map"></div>
    );
  }
}

export default App;
