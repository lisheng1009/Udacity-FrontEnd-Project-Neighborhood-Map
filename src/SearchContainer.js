import React, { Component } from 'react';
import './SearchContainer.css'

class SearchContainer extends Component {

    render() {
        console.log(this.props.selectedLocation)
        const { selectedLocation, updateKeyWord, onLocationSelected,locationsFromFourSquare } = this.props

        return (
            <div>
                <div className="filter-wrapper">
                    {/* <button className="hider" onClick={() => this.hideSearchContainer()}>隐藏</button> */}
                    <h3 className="title">Welcome To Barcelona !!</h3>
                    <input
                        className="filter"
                        placeholder="filter a location"
                        aria-label="location-input"
                        type="text"
                        onChange={(event) => updateKeyWord(event.target.value)}
                    />
                </div>
                <ul className="location-list">
                    {locationsFromFourSquare.map((location) => (
                        <li key={location.venue.id} >
                            <button className= { (location  ===  selectedLocation) ? "location selected" : "location" }  
                            onClick={() => onLocationSelected(location)}>{location.venue.name}</button>
                        </li>
                    ))}
                </ul>

            </div>
        )
    }

}

export default SearchContainer