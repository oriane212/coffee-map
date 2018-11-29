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
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalf } from '@fortawesome/free-solid-svg-icons';

library.add(faCoffee);
library.add(faStar);
library.add(faStarHalf);

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
    this.markerClick = this.markerClick.bind(this);
    this.rmMenuItemStyle = this.rmMenuItemStyle.bind(this);
    this.mapClick = this.mapClick.bind(this);
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
    //simItemClick(markerObj);
    let dist_lng = 0;
    let dist_lat = .12;
    if (window.innerWidth > 600) {
      dist_lng = .17;
      //dist_lat = .12;
    }
    this.map.flyTo({
      center: [
        markerObj.marker._lngLat.lng - dist_lng,
        markerObj.marker._lngLat.lat + dist_lat
      ],
      zoom: 9
      //speed: 1.2,
      //curve: 2
    })
  }


  /**
   * Simulates itemClick in menu with styling
   * @param {obj} markerObj 
   */
  
  markerClick(event) {
    console.log(`${this.state.markers[event.target.id].name} clicked`);
    let markerObj = this.state.markers[event.target.id];

    // zoom in and center map on marker location
    this.zoomTo(markerObj);

    let items = this.rmMenuItemStyle();

    // find div.list-item with innerHTML === this.state.markers[event.target.id].name
    // and then if the popup status is open, add className 'open' to the DOM el
    let mp = markerObj.marker.getPopup();
    // toggle open list item if popup is open
    if (mp.isOpen() === true) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].innerHTML === markerObj.name) {
          items[i].className = `list-item open`;
        }
      }
    }

  }

  // Removes any toggled open styling among list items
  // TODO: refactor without loop
  rmMenuItemStyle() {
    const items = document.querySelectorAll('.list-item');
    for (let i = 0; i < items.length; i++) {
      if (items[i].className === `list-item open`) {
        items[i].className = `list-item`;
      }
    }
    return items;
  }

  // TODO: should call rmMenuItemStyle() when 'button.mapboxgl-popup-close-button' clicked...
  // and should NOT call rmMenuItemStyle() when any other popup content is clicked...
  mapClick(event) {
    if (event.target.className !== 'marker mapboxgl-marker mapboxgl-marker-anchor-center') {
      this.rmMenuItemStyle();
    }
  }


  /**
   * Toggles list item styling and popup for marker matching list item clicked
   * @param {string} marker_name 
   * 
   */

  itemClick(list_item, item) {

    this.rmMenuItemStyle();

    this.state.markers.forEach((markerObj) => {
      // open popup for marker matching clicked list item
      if (markerObj.name === list_item) {
        // zoom in and center map on marker location
        this.zoomTo(markerObj);
        // toggle popup
        markerObj.marker.togglePopup();
        // get popup bound to marker
        let mp = markerObj.marker.getPopup();
        // toggle open list item if popup is open
        if (mp.isOpen() === true) {
          item.target.className = `list-item open`;
        }

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

    // create array to store markers
    let markers = [];

    // return promises
    Promise.all(promises).then((promises) => {

      let i = 0;
      // create a marker instance for each feature object
      promises.forEach((feature) => {

        // TODO: include attribution
        // pass custom marker DOM element attached to marker reference at index
        let marker = new mapboxgl.Marker(this.markerRef[i].current)
          .setLngLat(feature.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
            <div class='popup-text'>
              <h2>${feature.properties.title}</h2>
              <p>${feature.properties.description}</p>
              <FontAwesomeIcon icon="star" />
            </div>
            `))

        // create object containing marker instance and venue data
        let markerData = {
          name: feature.properties.title,
          category: feature.properties.description,
          marker: marker,
          vID: '',
          photo: []
          /*onClick: function() {
            App.markerClick(markerData.name);
          }*/
        }

        // fetch data for venue using Foursquare's Places API search
        fetch(`https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&limit=1&ll=${markerData.marker._lngLat.lat},${markerData.marker._lngLat.lng}&query=${markerData.name}`)
          .then((response) => {
            return response.json();
          })
          .then((myJson) => {
            //console.log(myJson);
            console.log(myJson.response.venues[0]);
            return myJson.response.venues[0].id;
          })
          .then((vID) => {
            markerData.vID = vID;

            ////////////////
            // TODO: simulate asynchronous fetch for photo data with hardcoded photo data
            //////////////// 

            // for now, only fetches for detailed venue info for one venue at a given index (to not exceed quota)
            if (i === 18) {

              // fetch more detailed data for venue using Foursquare's Places API VENUE_ID
              fetch(`https://api.foursquare.com/v2/venues/${markerData.vID}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180923`)
                .then((response) => {
                  return response.json();
                })
                .then((myJson) => {
                  console.log(myJson);
                  //console.log(myJson.response.venue.bestPhoto);
                  if (myJson.response.venue.bestPhoto != null) {
                    let pre = myJson.response.venue.bestPhoto.prefix;
                    let suf = myJson.response.venue.bestPhoto.suffix;
                    //return myJson.response.venue.bestPhoto;
                    return [pre, suf];
                  } else {
                    return []
                  }
                  //return markers[2];
                })
                .then((dataArr) => {
                  markerData.photo = dataArr; // works
                  console.log(markerData); // works
                  console.log(markerData.photo);
                  console.log(markerData.photo[0]);
                  //console.log(markerData[photo]); // doesn't work
                })

            }

          })
          .catch(function () {
            console.log('error');
          });

        // push markerData to array of markers
        markers.push(markerData);

        /*
        // start test code
        if (i === 3) {
          // store array of markers in state
          this.setState({
            markers: markers
          })
          console.log(this.state.markers[3].photo[0]);
          console.log(this.state.markers[3].photo);
          console.log(this.state.markers[3]['photo']);
          //console.log(this.state.markers[3][photo]);
          console.log(this.state.markers[3]);
        }
        // end test code
        */

        i++;

      })


      /*
        // response for markers[1] for example:
        Json.response.venue.bestPhoto
          .prefix: 'https://fastly.4sqi.net/img/general/',
          .height: 540,
          .width: 540,
          .id: '502406b3e4b090dce170f678',
          .suffix: '/0An7tGCgxhWoXdW9L0pfQiLGumhvIF6aH02GEd2HC_A.jpg'
      })
        // to construct this URL from photo data:
        https://fastly.4sqi.net/img/general/300x300/0An7tGCgxhWoXdW9L0pfQiLGumhvIF6aH02GEd2HC_A.jpg
      */

      // store array of markers in state
      this.setState({
        markers: markers
      })


    });



  }

  render() {

    let imgTests = [];

    // TODO: create image for each marker from photo data stored in this.state.markers
    // latest state does not appear to be reflected in render...
    // test code below results in an array consisting of a string "undefined300x300undefined" for each marker stored in state, eventhough all the photo data appears to have been successfully fetched and stored for each marker (ie, it shows up when inspecting the app's State in React dev tools)
    // start test code
    /*
    if (this.state.markers.length > 0) {
      this.state.markers.forEach((markerinArry) => {
        //imgTest = (<img src='' />);
        //imgTest.src = markerinArry.photo[0];
        let imgSrc = `${markerinArry.photo[0]}300x300${markerinArry.photo[1]}`;
        imgTests.push(imgSrc);
      })

      console.log(imgTests);
    }
    */
    // end test code


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
        <div id="map" onClick={(e) => this.mapClick(e)}></div>
        <div className='sidebar pad2'>
          <Select selection={this.state.selection} onSelection={this.onSelection}></Select>
          <List selection={this.state.selection} itemClick={this.itemClick} markers={this.state.markers.length !== 0 ? this.state.markers : []}></List>
        </div>

        {
          // create DOM element with ref for each marker to be rendered
          this.markerRef.map((reference) => {
            n++;
            return (
              <div className='marker' id={n - 1} key={n} ref={reference} onClick={(e) => this.markerClick(e)} />
            )
          })
        }

        <FontAwesomeIcon icon="coffee" />
        <FontAwesomeIcon icon="star" />
        <FontAwesomeIcon icon="star-half" />

      </div>

    );
  }
}

export default App;
