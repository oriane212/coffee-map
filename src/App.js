import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as CoffeePlaces from './CoffeePlaces';
import List from './List';
import Filters from './Filters';
import Select from './Select';
//var mbxGeocoding = require('@mapbox/mapbox-gl-geocoder');

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: -74.0226071,
      lat: 40.7786204,
      // TODO: zoom out further for smaller screen (use mapbox property expression?)
      zoom: 8.5,
      items: '',
      markers: [],
      filters: [
        { category: 'Cafe', show: true },
        { category: 'Restaurant', show: true }
      ],
      selection: 'All'
    };

    this.itemClick = this.itemClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSelection = this.onSelection.bind(this);
  }

  /**
   * Toggles popup for marker matching list item clicked
   * @param {string} marker_name 
   * 
   */
  itemClick(list_item) {
    this.state.markers.forEach((markerObj) => {
      // open popup for marker matching clicked list item
      if (markerObj.name === list_item) {
        markerObj.marker.togglePopup();
      }
      // close any other open marker popups
      else if (markerObj.name !== list_item) {
        // get popup bound to marker
        let mp = markerObj.marker.getPopup();
        // close popup if already open
        if (mp.isOpen() === true) {
          markerObj.marker.togglePopup();
        }
      }
    })

  }


  handleInputChange(filter, event) {

    const filtered = this.state.filters.filter(item => item.category !== filter.category);
    const modified = { category: filter.category, show: !filter.show };
    filtered.push(modified);

    this.setState({
      filters: filtered
    })

  }

  onSelection(event) {
    this.setState({
      selection: event.target.value
    })
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
            return;
          }


          // create array of markers
          let markers = [];

          // create a marker for each location, add to the map, and push object containing marker to markers array
          geojson.features.forEach((location) => {

                let marker = new mapboxgl.Marker()
                  .setLngLat(location.geometry.coordinates)
                  .setPopup(new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h3>${location.properties.title}</h3><p>${location.properties.description}</p>`))
                  .addTo(map);
                markers.push({
                  name: location.properties.title,
                  category: location.properties.description,
                  marker: marker
                });
        
            });

          // store array of markers in state
          this.setState({
            markers: markers
          })

        });
    })
  }

  render() {

    /* ref instead of id? */
    return (
      <div>
        <div id="map"></div>
        <div className='sidebar pad2'>
          <Select selection={this.state.selection} onSelection={this.onSelection}></Select>
          <List selection={this.state.selection} itemClick={this.itemClick} markers={this.state.markers.length !== 0 ? this.state.markers : []}></List>
        </div>

      </div>

    );
  }
}

export default App;
