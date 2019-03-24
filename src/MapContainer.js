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

  setActiveMarker = (props,marker) => {
    console.log(marker)
    this.setState({ activeMarker: marker }, () => {
      this.props.setActiveMarker(props,marker)
    })
  }

  render() {

    if(this.props.selectedLocation.venue){
      console.log(this.props.selectedLocation)
      console.log(this.props.selectedLocation.venue.name)
      console.log(this.props.showInfoWindow)
    }
    
    // console.log(this.props.selectedLocation, "------", this.props.locations)
    // console.log(this.props.locationsFromFourSquare)
    // console.log(this.locationsFromFourSquare.length)

    return (
      <Map
        google={this.props.google}
        zoom={14}
        onClick={()=>this.props.onMapClicked()}
        initialCenter={{
          lat: 41.38879,
          lng: 2.15899
        }}
        className="map"
        tabIndex="0"
      >
        {this.props.locationsFromFourSquare.map(location => (
          this.props.selectedLocation === location ?
            <Marker
              key={location.referralId}
              title={location.venue.name}
              position={{ lat: location.venue.location.lat, lng: location.venue.location.lng }}
              onClick={this.setActiveMarker}
              animation={this.props.google.maps.Animation.BOUNCE}
              tabIndex="1"
            /> :
            <Marker
              key={location.referralId}
              title={location.title}
              position={{ lat: location.venue.location.lat, lng: location.venue.location.lng }}
              onClick={this.setActiveMarker}
              tabIndex="1"
            />
        ))}

        {this.props.selectedLocation.venue ? <InfoWindow
          marker={this.props.activeMarker}
          visible={this.props.showInfoWindow}>
          <div>
            <h3>{this.props.selectedLocation.venue.name}</h3>
            <h5>{this.props.selectedLocation.venue.categories[0].name}</h5>
            <div>{this.props.selectedLocation.venue.location.formattedAddress[0]}</div>
            <div>{this.props.selectedLocation.venue.location.formattedAddress[1]}</div>
            <div>{this.props.selectedLocation.venue.location.formattedAddress[2]}</div>
            <div>---------Data From FourSquare</div>
          </div>

        </InfoWindow> : <div>loading data</div>}
        

      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBE3wylGyMIsU15yZjUpwk8iB2YJRCYrZU")
})(MapContainer)