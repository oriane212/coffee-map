import React, { Component } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as CoffeePlaces from './CoffeePlaces';
import List from './List';
import Filters from './Filters';
import Select from './Select';
//var mbxGeocoding = require('@mapbox/mapbox-gl-geocoder');
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

library.add(faCoffee)

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class App extends Component {

  constructor(props) {
    super(props);
    this.markerRef = [];
    this.totalMarkers = 17;
    // create an array of refs for each marker from total number of markers expected
    for (let i=0; i<this.totalMarkers; i++) {
      this.markerRef.push(React.createRef());
    }
    this.state = {
      lng: -73.8226071,
      lat: 40.6786204,
      // TODO: zoom out further for smaller screen (use mapbox property expression?)
      zoom: 7,
      //items: '',
      markers: [],
      /*filters: [
        { category: 'Cafe', show: true },
        { category: 'Restaurant', show: true }
      ],*/
      selection: 'All'
    };

    this.itemClick = this.itemClick.bind(this);
    //this.handleInputChange = this.handleInputChange.bind(this);
    this.onSelection = this.onSelection.bind(this);
    this.recenterMap = this.recenterMap.bind(this);
    this.zoomTo = this.zoomTo.bind(this);
  }

  /**
   * Recenters the map and resets zoom level to default
   */
  recenterMap() {
    this.map.flyTo({
      center: [
        this.state.lng,
        this.state.lat
      ],
      zoom: this.state.zoom
    })
  }

  /**
   * Zooms in and center map to marker location using Mapbox map object's flyTo method
   * @param {obj} markerObj containing marker instance
   * 
   */
  zoomTo(markerObj) {
    this.map.flyTo({
      center: [
        markerObj.marker._lngLat.lng, 
        markerObj.marker._lngLat.lat
      ], 
      zoom: 9
    })
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
        // zoom in and center map on marker location
        this.zoomTo(markerObj);
        // toggle popup
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

  /* unused function
  handleInputChange(filter, event) {
    const filtered = this.state.filters.filter(item => item.category !== filter.category);
    const modified = { category: filter.category, show: !filter.show };
    filtered.push(modified);
    this.setState({
      filters: filtered
    })
  }*/

  onSelection(event) {
    this.setState({
      selection: event.target.value
    })
    this.recenterMap();
  }

  componentDidMount() {

    // get current values stored in state
    const { lng, lat, zoom } = this.state;

    // initialize map object
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [lng, lat],
      zoom
    });

    // create geocoding client
    const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

    // array to store promises
    let promises = [];

    // forward geocode each coffee place address
    CoffeePlaces.coffeePlaces.forEach((place) => {
      // store each promise for feature object containing geocoded address
      let eachPromise = (
        geocodingClient.forwardGeocode({
          query: place.address,
          limit: 1
        })
          .send()
          .then((response) => {
            if (response != null && response.error == null) {
              // store feature object
              const feature = response.body.features[0];
              // add title and description properties
              feature.properties = {
                title: place.name,
                description: place.type
              }
              return feature;
            } else {
              return;
            }
          })
      )
      // store each promise in promises array
      promises.push(eachPromise);
    })

    // return promises
    Promise.all(promises).then((promises) => {

      // create array to store markers
      let markers = [];

      let i = 0;
      // create a marker instance for each feature object
      promises.forEach((feature) => {

        // TODO: include attribution
        // pass custom marker DOM element attached to marker reference at index
        let marker = new mapboxgl.Marker(this.markerRef[i].current)
          .setLngLat(feature.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`))

        // create object containing marker instance and push to array of markers
        markers.push({
          name: feature.properties.title,
          category: feature.properties.description,
          marker: marker
        });

        i++;

      })

      // store array of markers in state
      this.setState({
        markers: markers
      })

    });

  }

  render() {

    // filter and add markers to map
    this.state.markers.forEach((markerObj) => {
      if (this.state.selection !== 'All') {
        if (this.state.selection === markerObj.category) {
          markerObj.marker.addTo(this.map);
        } else {
          markerObj.marker.remove();
        }
      } else {
        markerObj.marker.addTo(this.map);
      }
    })

    //
    let n = 0;

    /* ref instead of id? */
    return (
      <div>
        <div id="map"></div>
        <div className='sidebar pad2'>
          <Select selection={this.state.selection} onSelection={this.onSelection}></Select>
          <List selection={this.state.selection} itemClick={this.itemClick} markers={this.state.markers.length !== 0 ? this.state.markers : []}></List>
        </div>

        {
          // create DOM element with ref for each marker to be rendered
          this.markerRef.map((reference) => {
            n++;
            return (
              <div className='marker' key={n} ref={reference} />
            )
          })
        }

        <FontAwesomeIcon icon="coffee" />
      </div>

    );
  }
}

export default App;
