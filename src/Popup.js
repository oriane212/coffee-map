import React, { Component } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

library.add(faDollarSign);

class Popup extends Component {

    componentDidMount() {
        this.props.buttonRef.current.focus();
    }    

    render() {

        //// TODO: replace hardcoded variables with venue props /////////////

        //let rating = this.props.venue.details.reponse.venue.rating;
        let rating = 8.6;

        // create path for photo
        let prefix = 'https://fastly.4sqi.net/img/general/';
        let suffix = '/145402484_1oXuwMI_RDXy02VTV0bsrwC9DXXJJDqjdbEEXqsV-p0.jpg';
        let path = prefix + '300x300' + suffix;

        // price
        //let tier = this.props.venue.details.response.venue.price.tier;
        //let message = this.props.venue.details.response.venue.price.message;
        let tier = 2;
        let message = 'Moderate';
        let dollarSigns = [];
        for (let i = 0; i < tier; i++) {
            dollarSigns.push(
                <FontAwesomeIcon aria-hidden title='Venue price' key={i} icon='dollar-sign' />
            )
        }

        return (
            <article className='my-popup'>
                <span className='sr-only'>Details for {this.props.venue.name}</span>
                <span className='popup-img' style={ {backgroundImage: `url(${path})`}} role='img' aria-label={this.props.venue.name}></span>
                <div className='popup-overlay'>
                    <div className='popup-text'>
                        <div className='overview'><span className='comedian'>Seinfeld</span> had coffee here with <span className='comedian'>{this.props.venue.comedian}</span></div>
                        <p className='venue-type'>{this.props.venue.category}</p>
                        <div className='rating'>
                            <div aria-hidden title='rating'>{rating}/10</div>
                            <span className='sr-only'>Venue rating is {rating} out of 10.</span>
                        </div>
                        <div className='price'>
                            {dollarSigns}
                            <span className='sr-only'>Venue price point is {message}</span>
                        </div>
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
