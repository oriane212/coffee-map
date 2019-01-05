import React, { Component } from 'react';
import './App.css';

class List extends Component {

    /**
    * Creates an unordered list of interactive venue names from an array of marker objects
    * @param {array} markers
    * uses props to determine filtering
    */
    createList(markers) {
        // create a list item for each venue if 'All' is selected
        // otherwise, create a list item for each venue with a category matching the user's selection
        let list =
            markers.map((marker) => {
                if (this.props.selection === 'All') {
                    return (
                        <li key={marker.name}
                            onKeyDown={(e) => this.props.itemClick(marker.name, e)}
                            onClick={(e) => this.props.itemClick(marker.name, e)}
                            className='list-item'
                            role="button"
                            tabIndex="0">
                            {marker.name}
                        </li>
                    )
                } else {
                    if (this.props.selection === marker.category) {
                        return (
                            <li key={marker.name}
                                onKeyDown={(e) => this.props.itemClick(marker.name, e)}
                                onClick={(e) => this.props.itemClick(marker.name, e)}
                                className='list-item'
                                role="button"
                                tabIndex="0">
                                {marker.name}
                            </li>
                        )
                    }
                }
                return list;
            })
        return list;
    }

    render() {
        let listDivs = '';
        if (this.props.markers !== []) {
            listDivs = this.createList(this.props.markers);
        } else {
            listDivs = (<li className="error-msg">There was a problem loading venue data. Try refreshing.</li>)
        }
        return (
            <ul ref={this.props.listRef} className='menu-items-container'>
                {listDivs}
            </ul>
        )
    }
}

export default List;