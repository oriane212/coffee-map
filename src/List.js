import React, { Component } from 'react';
import './App.css';


class List extends Component {

    constructor(props) {
        super(props);
    }

    createList(markers) {
        let list =
            markers.map((marker) => {
          return (
            <div onClick={(item) => this.props.itemClick(marker.name, item)}>{marker.name}</div>
          )
          })
        return list;
      }

      render() {

        let listDivs = '';
        console.log(this.props.markers);

        if (this.props.markers !== []) {
            listDivs = this.createList(this.props.markers);
        }
        
        return (

            <div>
                {listDivs}
            </div>

        )
      }
}

export default List;