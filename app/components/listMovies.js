import React, { Component } from 'react';
import {
  ScrollView,
} from 'react-native';

import Movie from './movie';

export default class ListMovies extends Component {
  render() {
    return (
      <ScrollView style={this.props.style}>
        {this.props.data.slice(0, 10).map((movie, index) => <Movie key={index} data={movie} />)}
      </ScrollView>
    )
  }
}
