import React, { Component } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalf } from '@fortawesome/free-solid-svg-icons';


library.add(faStar);
library.add(faStarHalf);

class Popup extends Component {

    componentDidMount() {
        this.props.buttonRef.current.focus();
    }    

    render() {

        let rating = parseInt(this.props.rating);
        let stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(
                <FontAwesomeIcon aria-hidden title='Venue rating' key={i} icon="star" />
            )
        }

        return (
            <article className='my-popup'>
                <span className='sr-only'>Details for {this.props.venue.name}</span>
                <span className='popup-img' role='img' aria-label={this.props.venue.name}></span>
                <div className='popup-overlay'>
                    <div className='popup-text'>
                        <div className='stars'>
                            {stars}
                            <span className='sr-only'>Venue rating is {this.props.rating} stars.</span>
                        </div>
                        <p className='venue-type'>{this.props.venue.category}</p>
                        <address className='venue-details'>{this.props.venue.address}</address>
                    </div>
                    <button ref={this.props.buttonRef} id="close-popup" onKeyDown={(e) => this.props.close(e)} onClick={(e) => this.props.close(e)} aria-label="close">X</button>
                </div>
            </article>
        )
    }
}

// temporarily taken out of span.popup-img...
// TODO: change the below backgroundImage url to photo stored in venue details:
    // ${this.props.venue.details.response.venue.bestPhoto.prefix}300x300${this.props.venue.details.response.venue.bestPhoto.suffix}
// style={ {backgroundImage: `url(${this.props.venue.photo})`}}

export default Popup;
