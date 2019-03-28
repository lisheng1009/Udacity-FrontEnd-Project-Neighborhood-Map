import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';


class LoadingContainer extends Component {
  state = {
    content: '加载中...'
  }
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ content: '加载超时，请检查网络！' });
    }, 1000);
  }
  componentWillUnmount() {
    // 清除计时器
    clearTimeout(this.timer);
  }
  render() {
    return (
      this.state.content
    )
  }
}

export class MapContainer extends Component {


  // state = {
  //   activeMarker: {},
  // }

  setActiveMarker = (props, marker) => {
    console.log(marker)
    // this.setState({ activeMarker: marker }, () => {
    this.props.setActiveMarker(props, marker)
    // })
  }

  render() {

    if (this.props.selectedLocation.venue) {
      console.log(this.props.selectedLocation)
      console.log(this.props.activeMarker)
      console.log(this.props.showInfoWindow)
      // console.log(this.props.selectedLocation.venue.name)
      // console.log(this.props.showInfoWindow)
    }

    // console.log(this.props.selectedLocation, "------", this.props.locations)
    // console.log(this.props.locationsFromFourSquare)
    // console.log(this.locationsFromFourSquare.length)

    return (
      <Map
        google={this.props.google}
        zoom={14}
        onClick={() => this.props.onMapClicked()}
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
              aria-label="map-marker"
            /> :
            <Marker
              key={location.referralId}
              title={location.venue.name}
              position={{ lat: location.venue.location.lat, lng: location.venue.location.lng }}
              onClick={this.setActiveMarker}
              tabIndex="1"
              aria-label="map-marker"
            /**
             * 问题1: 这里添加了焦点. 但是实际操作了一下, 聚焦到这里然后回车, 并没有触发onClick这个方法而是跳入了谷歌地图页面(应用外)
             */

            /**
            * 问题2: 应用载入以后, 首次点击marker, 触发跳动动画但是不弹出InfoWindow, 再次点击此marker或其他marker就可以显示InfoWindow了
            * 明明第一次也有值的,也出现了动画,不解.
            */
            />
        ))}

        <InfoWindow
          marker={this.props.activeMarker}
          visible={this.props.showInfoWindow}>
          {this.props.selectedLocation.venue ?
            <div>
              <h3>{this.props.selectedLocation.venue.name}</h3>
              <h5>{this.props.selectedLocation.venue.categories[0].name}</h5>
              <div>{this.props.selectedLocation.venue.location.formattedAddress[0]}</div>
              <div>{this.props.selectedLocation.venue.location.formattedAddress[1]}</div>
              <div>{this.props.selectedLocation.venue.location.formattedAddress[2]}</div>
              <div>---------Data From FourSquare</div>
            </div> : <div>loading data</div>}

        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyBE3wylGyMIsU15yZjUpwk8iB2YJRCYrZU"),
  LoadingContainer: LoadingContainer
})(MapContainer)