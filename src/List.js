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
                        <div key={marker.name} onClick={(e) => this.props.itemClick(marker.name, e.target)} className='list-item'>{marker.name}</div>
                      )
                } else {
                    if(this.props.selection === marker.category) {
                        return (
                            <div key={marker.name} onClick={(e) => this.props.itemClick(marker.name, e.target)} className='list-item'>{marker.name}</div>
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

            <div className='menu-items-container'>
                {listDivs}
            </div>

        )
      }
}

export default List;