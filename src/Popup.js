import React, { Component } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalf } from '@fortawesome/free-solid-svg-icons';


library.add(faStar);
library.add(faStarHalf);

class Popup extends Component {

    render() {

        let rating = parseInt(this.props.rating);
        let stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(
                <FontAwesomeIcon key={i} icon="star" />
            )
        }

        return (
            <div className='my-popup'>
                <span className='popup-img' style={ {backgroundImage: `url(${this.props.venue.photo})`}} role='img' aria-label={this.props.venue.name}></span>
                <div className='popup-overlay'>
                    <div className='popup-text'>
                        <div className='stars'>
                            {stars}
                        </div>
                        <p className='venue-type'>{this.props.venue.category}</p>
                        <p className='venue-details'>{this.props.venue.address}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Popup;
