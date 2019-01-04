import React, { Component } from 'react';
import { Fragment } from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import * as CoffeePlaces from './CoffeePlaces';
import List from './List';
import Select from './Select';
import Popup from './Popup';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

// Foursquare IDs for this app
const CLIENT_ID = 'PPYFQDE4ES3RAZHYQRKXI0RPWURQ1RPIAIU3VHENMNSKEX1S';
// TODO: make private?
const CLIENT_SECRET = 'XAWDVQKUAC1OBT5JUSALYUJTN34FA3H5YZPTFN3145OUM5CL';


class App extends Component {

  constructor(props) {
    super(props);
    this.markerRef = [];
    this.totalMarkers = 17;
    // create an array of refs for each marker from total number of markers expected
    for (let i = 0; i < this.totalMarkers; i++) {
      this.markerRef.push(React.createRef());
    }
    this.buttonEl = React.createRef();
    this.state = {
      lng: -73.0226071,
      lat: 40.6786204,
      zoom: 6.5,
      markers: [],
      selection: 'All',
      open: '',
      details: ''
    };

    this.itemClick = this.itemClick.bind(this);
    this.onSelection = this.onSelection.bind(this);
    this.recenterMap = this.recenterMap.bind(this);
    this.zoomTo = this.zoomTo.bind(this);
    this.markerClick = this.markerClick.bind(this);
    this.rmMenuItemStyle = this.rmMenuItemStyle.bind(this);
    this.rmMarkerStyle = this.rmMarkerStyle.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  /**
   * Closes popup and removes 'open' styling
   */
  closePopup(event) {
    if (event.type === 'click' || (event.key === 'Enter' || event.key === ' ')) {

      this.rmMarkerStyle();
      // TODO: DOM element of items should be global ref...
      const items = this.rmMenuItemStyle();

      if (event.key === 'Enter' || event.key === ' ') {
        // TODO: refactor?
        for (let i = 0; i < items.length; i++) {
          if (items[i].innerHTML === this.state.open.name) {
            items[i].focus();
          }
        }
      }

      this.setState({
        open: ''
      })

    }
  }

  /**
   * Recenters the map and resets zoom level to default
   */
  recenterMap() {
    let zoomlevel = 6.8;
    if (window.innerWidth < 450) {
      zoomlevel = 6.5;
    }
    this.map.flyTo({
      center: [
        this.state.lng,
        this.state.lat
      ],
      zoom: zoomlevel
    })
    this.setState({
      open: ''
    })
  }

  /**
   * Zooms in and center map to marker location using Mapbox map object's flyTo method
   * @param {obj} markerObj containing marker instance
   * 
   */
  zoomTo(markerObj) {
    let dist_lng = -0.04;
    let dist_lat = 0;
    if (window.innerWidth > 600) {
      dist_lng = -0.03;
      dist_lat = -0.01;
    }
    this.map.flyTo({
      center: [
        markerObj.marker._lngLat.lng + dist_lng,
        markerObj.marker._lngLat.lat + dist_lat
      ],
      zoom: 10.5
      //speed: 1.2,
      //curve: 2
    })
    this.setState({
      open: markerObj
    })
  }


  /**
   * Handles map marker click and simulates menu item click
   * @param {string} venue_name - Empty by default, and remains empty unless the click was simulated.
   * @param event - Empty by default to allow for a simulated click event.
   */

  markerClick(venue_name = '', event = '') {

    // remove any already 'open' marker styles
    this.rmMarkerStyle();

    let markerObj = '';
    let markerEl = '';

    // if the marker was actually clicked, simulate its corresponding menu item click
    if (event !== '') {
      // store marker object for marker at index matching DOM element's id
      //console.log(`${this.state.markers[eventTarget.id].name} clicked`);
      let eventTarget = event.target;
      markerEl = eventTarget;
      markerObj = this.state.markers[eventTarget.id];
      this.itemClick(markerObj.name, '');

    } else {
      // otherwise, use the venue name to locate the marker in state, and use index matching the marker's DOM element ID
      this.state.markers.forEach((marker, index) => {
        if (marker.name === venue_name) {
          markerObj = marker;
          markerEl = document.getElementById(index);
        }
      })
    }

    // add open-marker class to DOM marker
    markerEl.classList.toggle('open-marker');
    // zoom in and center map on marker location
    this.zoomTo(markerObj);

  }

  rmMarkerStyle() {
    const open_marker = document.querySelector('.open-marker');
    if (open_marker != null) {
      open_marker.classList.toggle('open-marker');
    }
    return;
  }

  // Removes any toggled open styling among list items

  //////// TODO: Refactor without loop. Return item that was open instead of all items, and use a global react ref for DOM element of items instead?

  rmMenuItemStyle() {
    const items = document.querySelectorAll('.list-item');
    for (let i = 0; i < items.length; i++) {
      if (items[i].className === `list-item open`) {
        items[i].className = `list-item`;
      }
    }
    return items;
  }

  /**
   * Handles menu item click and simulates map marker click
   * @param {string} venue_name
   * @param event - Empty by default to allow for a simulated click event.
   * 
   */

  itemClick(venue_name, event = '') {

    // remove any already 'open' menu item styles
    let items = this.rmMenuItemStyle();

    // if the menu item was actually clicked, then toggle its style and simulate its corresponding map marker click
    // include event.key 'Spacebar' for older browsers
    if (event.type === 'click' || event.key === ' ' || event.key === 'Spacebar') {
    
      let eventTarget = event.target;
      eventTarget.classList.toggle('open');
      this.markerClick(venue_name, '');

    } else if (event === '') {
      // otherwise loop through to find the DOM element with inner HTML matching the venue name and toggle its style
      for (let i = 0; i < items.length; i++) {
        if (items[i].innerHTML === venue_name) {
          items[i].classList.toggle('open');
        }
      }
    }

  }

  onSelection(event) {
    this.rmMarkerStyle();
    this.rmMenuItemStyle();
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
              console.log(feature);
              // add title, description, and comedian properties
              feature.properties = {
                title: place.name,
                description: place.type,
                comedian: place.comedian
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

    // create array to store markers
    let markers = [];

    // return promises
    Promise.all(promises).then((promises) => {

      let i = 0;
      // create a marker instance for each feature object
      promises.forEach((feature) => {

        // pass custom marker DOM element attached to marker reference at index
        let marker = new mapboxgl.Marker(this.markerRef[i].current)
          .setLngLat(feature.geometry.coordinates)

        // create object containing marker instance and venue data
        let markerData = {
          name: feature.properties.title,
          category: feature.properties.description,
          address: feature.place_name,
          comedian: feature.properties.comedian,
          marker: marker,
          vID: '',
          details: ''
        }

        // push markerData to array of markers
        markers.push(markerData);
        i++;

      })

      // store array of markers in state
      this.setState({
        markers: markers
      })

    });

  }

  // TODO: uncomment when ready to test with fetched data again..
  /*
  componentDidUpdate() {

    // fetch venue details if they have not already been fetched or not currently being fetched
    if (this.state.details === '') {

      // update state of details to prevent repeated fetch calls while in progress
      this.setState({
        details: 'fetching'
      })
      console.log('fetching');

      let proms = [];
      let markers = this.state.markers;
      markers.forEach((marker) => {
        // fetch data for venue using Foursquare's Places API search
        let prom = (
          fetch(`https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&limit=1&ll=${marker.marker._lngLat.lat},${marker.marker._lngLat.lng}&query=${marker.name}`)
            .then((response) => {
              return response.json();
            })
            .then((myJson) => {
              //console.log(myJson);
              console.log(myJson.response.venues[0]);
              return myJson.response.venues[0].id;
            })
        )

        proms.push(prom);
      })


      Promise.all(proms).then((proms) => {

        markers.forEach((marker, index) => {

          // fetch details using proms[index], which should be the venue id
          // then set the marker.details to the response
          fetch(`https://api.foursquare.com/v2/venues/${proms[index]}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180923`)
            .then((response) => {
              return response.json();
            })
            .then((myJson) => {
              console.log(myJson);
              marker.details = myJson;
            })

        })

        // update array of markers in state
        this.setState({
          markers: markers
        })

        // update state of details when all fetching is complete
        this.setState({
          details: 'fetched'
        })
        console.log('fetched');
      })

    }

  }
  */

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

    let popupComp = '';
    if (this.state.open !== '') {
      let mObj = this.state.open;
      popupComp = (
        <Popup className='my-popup' venue={mObj} buttonRef={this.buttonEl} close={this.closePopup} />
      )
    }

    // initialize counter for creating marker elements
    let n = 0;

    /* ref instead of id? */
    return (
      <Fragment>
        <section role='presentation' aria-label="Map view of listed venues" id="map"></section>
        <section aria-label="Filterable list of venues" className='sidebar pad2'>
          <Select selection={this.state.selection} onSelection={this.onSelection}></Select>
          <List selection={this.state.selection} itemClick={this.itemClick} markers={this.state.markers.length !== 0 ? this.state.markers : []}></List>
          <footer className='app-info'>
            <p>Locations and other details for a handful of East Coast venues visited in Jerry Seinfeld’s show <i>Comedians in Cars Getting Coffee</i>.</p>
            <hr />
            <p style={{fontSize:0.8+'em', lineHeight:1.5+'em'}}>This web app was built with React and uses Mapbox GL JS and Foursquare’s Places APIs.</p>
          </footer>
        </section>
        <section id='popup' aria-live='polite' aria-label='Venue details'>
          {popupComp}
        </section>

        {
          // create DOM element with ref for each marker to be rendered
          this.markerRef.map((reference) => {
            n++;
            return (
              <div className='marker' id={n - 1} key={n} ref={reference} onClick={(e) => this.markerClick('', e)} />
            )
          })
        }
      </Fragment>
    );
    
  }
}

export default App;
