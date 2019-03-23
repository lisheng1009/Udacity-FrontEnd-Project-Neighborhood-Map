import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import MapContainer from './MapContainer';
import SearchContainer from './SearchContainer';
import * as locations from './Locations'
import escapeRegExp from 'escape-string-regexp'

class App extends Component {

  state = {
    locations: [],
    selectedLocation: {},
    showInfoWindow: false,
    showList: true,
    locationsFromFourSquare:[]
  }

  componentDidMount() {
    fetch('https://api.foursquare.com/v2/venues/explore?client_id=VWU4EEBHDN4RV1PS5MKGS3JCX0WYR2UWTVDYNU34PEB4WDLN&client_secret=HORQIXTRK34SLXT1EKPNHHXKK2GAUFLI22ILYRJLD4WLVPEK&v=20180323&limit=20&ll=40.7243,-74.0018&query=coffee')
    .then((response)=> {
        // Code for handling API response
        console.log(response.json())
        this.setState({
          locationsFromFourSquare : response.response.groups[0].items
        })
    })
    .catch(function(error) {
        // Code for handling errors
        console.log(error)
        alert("糟糕, 没有正确加载地址API!")
    });


    this.setState({ locations: locations.locations })
    console.log(this)
  }

  updateSelectedLocation = (location) => {
    this.setState({
      selectedLocation: location,
      showInfoWindow: true
    })
  }

  updateKeyWord = (keyWord) => {
    if (keyWord === '') {
      this.setState({ locations: locations.locations })
    } else {
      const match = new RegExp(escapeRegExp(keyWord), 'i')
      var resultLocations = this.state.locations.filter((location) => match.test(location.title))
      this.setState({ locations: resultLocations })
    }
  }

  setActiveMarker = (marker) => {
    var location = { title: marker.name, location: marker.position }
    console.log(location)
    this.setState({
      selectedLocation: location,
      showInfoWindow: true
    })
  }

  hideSearchContainer = () => {
    this.setState({
      showList: !this.state.showList
    })
    
  }


  render() {
    console.log(this.state.showInfoWindow)
    console.log(this.state.locationsFromFourSquare)
    return (
      <div className="App">
        <div className="head">
        <image src="/snow-icon.png"></image>
          <div className="hider" onClick={() => this.hideSearchContainer()}>隐藏/显示 </div>
        </div>
        <div className={this.state.showList ? "searchContainer":"searchContainer hidden"}   >
          <SearchContainer
            locations={this.state.locations}
            onLocationSelected={this.updateSelectedLocation}
            selectedLocation={this.state.selectedLocation}
            updateKeyWord={this.updateKeyWord}
          // activeLocation={this.ac}
          />
        </div>
        <div className={this.state.showList ? "mapContainer" : "mapContainer full"}>
          <MapContainer
            locations={this.state.locations}
            selectedLocation={this.state.selectedLocation}
            showInfoWindow={this.state.showInfoWindow}
            setActiveMarker={this.setActiveMarker}
          />
        </div>


      </div>
    );
  }
}

export default App;
