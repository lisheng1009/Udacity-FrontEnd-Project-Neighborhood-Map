import React, { Component } from 'react';
import hideImage from './snow-icon.png';
import './App.css';

import MapContainer from './MapContainer';
import SearchContainer from './SearchContainer';
import * as locations from './Locations'
import escapeRegExp from 'escape-string-regexp'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

class App extends Component {

  state = {
    locations: [],
    selectedLocation: {},
    showInfoWindow: false,
    showList: true,
    locationsFromFourSquare: [],
    allLocations:[],
    activeMarker:{}
  }

  componentDidMount() {
    //从fetchSquare获取位置数据
    fetch('https://api.foursquare.com/v2/venues/explore?client_id=VWU4EEBHDN4RV1PS5MKGS3JCX0WYR2UWTVDYNU34PEB4WDLN&client_secret=HORQIXTRK34SLXT1EKPNHHXKK2GAUFLI22ILYRJLD4WLVPEK&v=20180323&limit=15&ll=40.7243,-74.0018')
      .then((response) => {
        return response.json()
      }).then((this.initialLoctaions))
      .catch(function (error) {
        alert("糟糕, 没有正确加载地址API!", error)
      });

    // //开始用的假的地址数据
    // this.setState({ locations: locations.locations })
  }

  //处理位置数据, 更新到state
  initialLoctaions = (locations) => {
    this.setState({ 
      locationsFromFourSquare: locations.response.groups[0].items,
      allLocations:locations.response.groups[0].items
     })
  }

  //在搜索板块点击某位置的回调
  updateSelectedLocation = (location) => {
    console.log(location)
    console.log(location.venue.location.lat)
    // debugger;
    this.setState({
      selectedLocation: location,
      showInfoWindow: true,
      // activeMarker: <Marker
    //   position={
    //     {lat: 40.7243,
    //     lng: -74.0018}}
    //   title="nnnnnnn"
    // />
    })
  }

  //过滤地址
  updateKeyWord = (keyWord) => {
    if (keyWord === '') {
      this.setState({ locationsFromFourSquare: this.state.allLocations })
    } else {
      const match = new RegExp(escapeRegExp(keyWord), 'i')
      var resultLocations = this.state.locationsFromFourSquare.filter((location) => match.test(location.venue.name))
      this.setState({ locationsFromFourSquare: resultLocations })
    }
  }

  //地图板块选中marker以后的回调
  setActiveMarker = (props,marker) => {
    console.log(props)
    console.log(marker)
    //这里需要处理一下marker. 因为从地图点击marker传过来的是marker信息不是location信息, 需要比对经纬度查到是哪个location, 这样才能和左边地址栏进行联动
    for(let i = 0; i < this.state.locationsFromFourSquare.length; i++){
      if (this.state.locationsFromFourSquare[i].venue.location.lat === props.position.lat && this.state.locationsFromFourSquare[i].venue.location.lng === props.position.lng) {
        this.setState({
          selectedLocation : this.state.locationsFromFourSquare[i],
          showInfoWindow: true,
          activeMarker: marker
        })        
      }
    }
  }

  //点击隐藏或显示左边地址栏
  hideSearchContainer = () => {
    this.setState({
      showList: !this.state.showList
    })

  }


  render() {
    // console.log(this.state.locationsFromFourSquare)
    console.log(this.state.selectedLocation)
    return (
      <div className="App">
        <div className="head">
          {/* <img src={hideImage} alt="to-hide" className="hideImage" /> */}
          <div className="hider" onClick={() => this.hideSearchContainer()}>点击隐藏/显示地址栏 </div>
        </div>
        <div className={this.state.showList ? "searchContainer" : "searchContainer hidden"}   >
          <SearchContainer
            locations={this.state.locations}
            onLocationSelected={this.updateSelectedLocation}
            selectedLocation={this.state.selectedLocation}
            updateKeyWord={this.updateKeyWord}
            locationsFromFourSquare={this.state.locationsFromFourSquare}
          />
        </div>
        <div className={this.state.showList ? "mapContainer" : "mapContainer full"}>
          <MapContainer
            locations={this.state.locations}
            selectedLocation={this.state.selectedLocation}
            showInfoWindow={this.state.showInfoWindow}
            setActiveMarker={this.setActiveMarker}
            locationsFromFourSquare={this.state.locationsFromFourSquare}
            activeMarker={this.state.activeMarker}
          />
        </div>


      </div>
    );
  }
}

export default App;
