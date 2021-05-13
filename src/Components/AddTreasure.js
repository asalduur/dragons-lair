import axios from 'axios';
import React, { Component } from 'react';

export default class AddTreasure extends Component {
  constructor() {
    super();
    this.state = {
      treasureURL: '',
    };
  }

  handleInput(e) {
    this.setState({ treasureURL: e.target.value });
  }

  addTreasure() {
    const {treasureURL} = this.state
    const {addMyTreasure} = this.props
    axios
      .post('/api/treasure/user', {treasureURL: treasureURL})
      .then((res) => {
        addMyTreasure(res.data)
        this.setState({
          treasureURL: ''
        })
      })
      .catch((err) => alert(err.response.request.response))
  }

  render() {
    return (
      <div className="addTreasure">
        <input
          type="text"
          placeholder="Add image URL"
          onChange={e => this.handleInput(e)}
          value={this.state.treasureURL}
        />
        <button onClick={() => this.addTreasure()}>Add</button>
      </div>
    );
  }
}
