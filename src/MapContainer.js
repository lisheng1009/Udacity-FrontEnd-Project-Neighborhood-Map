import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import './MapContainer.css'

// class MapContainer extends Component {

// var map;
// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: { lat: 40.7413569, lng: -73.9980244 },
//         zoom: 13
//     })
//     var tribeca = { lat: 40.719526, lng: -74.0089934 }
//     var marker = new google.maps.Marker({
//         position: tribeca,
//         map: map,
//         title: 'this is tribeca!'
//     })

//     var infoWindow = new google.maps.InfoWindow({
//         content: 'yyyyyyyyyyyyyyyyy'
//     })

//     marker.addListener('click',function(){
//         infoWindow.open(map, marker)
//     })
// }


// }

// export default MapContainer
//lat: -54.074374, lng:-68.546936





export class MapContainer extends Component {


  state = {
    activeMarker: {},
  }

  setActiveMarker = (marker) => {
    console.log(marker)
    this.setState({ activeMarker: marker }, () => {
      this.props.setActiveMarker(marker)
    })
  }


  //选中某location
  selectOneLocation(location) {
    console.log(location.selectedLocation)
    // Map.map.panTo({
    //   lat: 41.7413549,
    //   lng: -72.9980244
    // })
  }



  componentWillReceiveProps(location) {
    this.selectOneLocation(location)
  }



  render() {

    console.log(this.state.activeMarker)
    console.log(this.props.selectedLocation, "------", this.props.locations)

    return (
      <Map
        google={this.props.google}
        zoom={12}
        initialCenter={{
          lat: 40.7413549,
          lng: -73.9980244
        }}
      >
        {this.props.locations.map(location => (
          this.props.selectedLocation === location ? 
          <Marker
            key={location.title}
            name={location.title}
            position={location.location}
            onClick={this.setActiveMarker}
            animation={this.props.google.maps.Animation.BOUNCE}
          /> : 
          <Marker
            key={location.title}
            name={location.title}
            position={location.location}
            onClick={this.setActiveMarker}
          />
        ))}

        <InfoWindow
          marker={this.state.activeMarker}
        // visible={this.props.showInfoWindow}
        />

      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBE3wylGyMIsU15yZjUpwk8iB2YJRCYrZU")
})(MapContainer)