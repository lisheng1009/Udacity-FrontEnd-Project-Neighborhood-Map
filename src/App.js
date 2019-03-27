import React, { Component } from 'react';
import hideShowImage from './hide-or-show.png';
import './App.css';

import MapContainer from './MapContainer';
import SearchContainer from './SearchContainer';
import escapeRegExp from 'escape-string-regexp'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

class App extends Component {

  state = {
    // locations: [],
    selectedLocation: {},//选中的地址
    showInfoWindow: false,//是否显示地址详细信息
    showList: true,//是否显示左边栏
    locationsFromFourSquare: [],//当前显示的地址(取名有点别扭了)
    allLocations: [],//所有的地址, 备用
    activeMarker: {}//当前激活的marker
  }

  componentDidMount() {

    function _fetch(fetch_promise, timeout) {
      var abort_fn = null;

      //这是一个可以被reject的promise
      var abort_promise = new Promise(function (resolve, reject) {
        abort_fn = function () {
          reject('abort promise');
        };
      });

      //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
      var abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
      ]);

      setTimeout(function () {
        abort_fn();
      }, timeout);

      return abortable_promise;
    }


    //从fourSquare获取位置数据
    _fetch(fetch('https://api.foursquare.com/v2/venues/explore?client_id=VWU4EEBHDN4RV1PS5MKGS3JCX0WYR2UWTVDYNU34PEB4WDLN&client_secret=HORQIXTRK34SLXT1EKPNHHXKK2GAUFLI22ILYRJLD4WLVPEK&v=20180323&limit=10&near=Barcelona'),2000)
      .then((response) => {
        return response.json()
      }).then((this.initialLoctaions))//处理位置数据, 更新到state
      .catch(function (error) {
        alert("糟糕, 没有正确加载地址API!", error)
      });
  }

  //处理位置数据, 更新到state
  initialLoctaions = (locations) => {
    this.setState({
      locationsFromFourSquare: locations.response.groups[0].items,
      allLocations: locations.response.groups[0].items
    })
  }

  //在搜索板块点击某位置的回调
  updateSelectedLocation = (location) => {
    // console.log(location)
    // console.log(location.venue.location.lat)
    this.setState({
      selectedLocation: location,
      showInfoWindow: true,
      //   activeMarker: <Marker
      //   position={
      //     {lat: 40.7243,
      //     lng: -74.0018}
      //   }
      //   title="nnnnnnn"
      //   map={this.props.MapContainer}
      // />

      /**
        * 问题0: 应用载入以后, 首先点击marker会出现InfoWindow.
        *       但是如果最先点击的是地址就不会出现InfoWindow,因为没有传过来marker, 而地图板块的InfoWindow需要一个marker参数.
        *       这里地址栏有的只是地址信息, 无法传递marker, 所以我本来想的是上面代码那样制作一个marker, 但是直接崩溃了. 
        *       麻烦审阅老师给个思路.O(∩_∩)O谢谢!
        */

    })
  }

  //输入, 过滤地址
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
  setActiveMarker = (props, marker) => {
    // console.log(props)
    // console.log(marker)
    //这里需要处理一下marker. 因为从地图点击marker传过来的是marker信息不是location信息, 需要比对经纬度查到是哪个location, 这样才能和左边地址栏进行联动
    for (let i = 0; i < this.state.locationsFromFourSquare.length; i++) {
      if (this.state.locationsFromFourSquare[i].venue.location.lat === props.position.lat && this.state.locationsFromFourSquare[i].venue.location.lng === props.position.lng) {
        this.setState({
          selectedLocation: this.state.locationsFromFourSquare[i],
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

  //点击地图空白处 隐藏InfoWindow
  onMapClicked = () => {
    console.log("onMapClicked")
    this.setState({ showInfoWindow: false })
  }


  render() {
    // console.log(this.state.locationsFromFourSquare)
    console.log(this.state.selectedLocation)
    return (
      <div className="App">
        <div className="head">
          {/* <img src={hideImage} alt="to-hide" className="hideImage" /> */}
          <button className="hider" background={hideShowImage} onClick={() => this.hideSearchContainer()}></button>
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
            onMapClicked={this.onMapClicked}
          />
        </div>
      </div>
    );
  }
}

export default App;
