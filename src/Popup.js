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
        
        let rating = null;
        let tier = null;
        let message = null;
        let imgSpan = '';
        let price = '';
        
        if (this.props.venue.details !== '') {
            // set rating
            rating = this.props.venue.details.reponse.venue.rating;

            // create DOM el for venue img
            //let prefix = 'https://fastly.4sqi.net/img/general/';
            //let suffix = '/145402484_1oXuwMI_RDXy02VTV0bsrwC9DXXJJDqjdbEEXqsV-p0.jpg';
            let prefix = this.props.venue.details.response.venue.bestPhoto.prefix;
            let suffix = this.props.venue.details.response.venue.bestPhoto.suffix;
            
            if (prefix != null && suffix != null) {
                let path = prefix + '300x300' + suffix;
                imgSpan = (
                    <span className='popup-img' style={{ backgroundImage: `url(${path})` }} role='img' aria-label={this.props.venue.name}></span>
                )
            }

            // create DOM el for price
            //tier = 2;
            //message = 'Moderate';
            tier = this.props.venue.details.response.venue.price.tier;
            message = this.props.venue.details.response.venue.price.message;
            if (tier != null && message != null) {
                let dollarSigns = [];
                for (let i = 0; i < tier; i++) {
                    dollarSigns.push(
                        <FontAwesomeIcon aria-hidden title='Venue price' key={i} icon='dollar-sign' />
                    )
                }
                price = (
                    <div className='price'>
                        {dollarSigns}
                        <span className='sr-only'>Venue price point is {message}</span>
                    </div>
                )
            }

        }

        return (
            <article className='my-popup'>
                {imgSpan}
                <div className='popup-overlay'>
                    <div className='popup-text'>
                        <div className='overview'><span className='comedian'>Seinfeld</span> had coffee here with <span className='comedian'>{this.props.venue.comedian}</span></div>
                        <p className='venue-type'>{this.props.venue.category}</p>
                        {rating != null ? (
                            <div className='rating'>
                                <div aria-hidden title='rating'>{rating}/10</div>
                                <span className='sr-only'>Venue rating is {rating} out of 10.</span>
                            </div>
                        ) : ''}
                        {price}
                        <address className='venue-details'>{this.props.venue.address}</address>
                    </div>
                    <button tabIndex='0' ref={this.props.buttonRef} id="close-popup" onKeyDown={(e) => this.props.close(e)} onClick={(e) => this.props.close(e)} aria-label="close">X</button>
                </div>
            </article>
        )
    }
}

export default Popup;
