import React, { Component } from 'react';
import './App.css';


class List extends Component {

    constructor(props) {
        super(props);
    }

    createList(markers) {
        let list =
            markers.map((marker) => {
                if(this.props.selection === 'All') {
                    return (
                        <li key={marker.name} onClick={(e) => this.props.itemClick(marker.name, e.target)} className='list-item' tabindex="0">{marker.name}</li>
                      )
                } else {
                    if(this.props.selection === marker.category) {
                        return (
                            <li key={marker.name} onClick={(e) => this.props.itemClick(marker.name, e.target)} className='list-item' tabindex="0">{marker.name}</li>
                          )
                    }
                }
          
          })
        return list;
      }

      render() {

        let listDivs = '';
        if (this.props.markers !== []) {
            listDivs = this.createList(this.props.markers);
        }
        
        return (

            <ul className='menu-items-container'>
                {listDivs}
            </ul>

        )
      }
}

export default List;