import React, { Component } from 'react';
import './SearchContainer.css'

class SearchContainer extends Component {

    render() {
        console.log(this.props.selectedLocation)
        const { locations, selectedLocation, updateKeyWord, onLocationSelected } = this.props

        return (
            <div>
                <div className="filter-wrapper">
                    {/* <button className="hider" onClick={() => this.hideSearchContainer()}>隐藏</button> */}
                    <input
                        className="filter"
                        placeholder="filte a location"
                        aria-label="location-input"
                        type="text"
                        onChange={(event) => updateKeyWord(event.target.value)}
                    />
                </div>
                <ul className="location-list">
                    {locations.map((location) => (
                        <li key={location.title} >
                            <button className= { (location.location  ===  selectedLocation.location) ? "location selected" : "location" }  
                            onClick={() => onLocationSelected(location)}>{location.title}</button>
                        </li>
                    ))}
                </ul>

            </div>
        )
    }

}

export default SearchContainer