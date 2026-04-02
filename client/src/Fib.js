import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const res = await axios.get('/api/values/current');
      this.setState({ values: res.data });
    } catch (err) {
      console.error('Failed to fetch values', err);
      this.setState({ values: {} });
    }
  }

  async fetchIndexes() {
    try {
      const res = await axios.get('/api/values/all');
      const data = res.data;

      // Ensure it's always an array
      this.setState({
        seenIndexes: Array.isArray(data) ? data : [],
      });
    } catch (err) {
      console.error('Failed to fetch indexes', err);
      this.setState({ seenIndexes: [] });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/api/values', { index: this.state.index });
      this.setState({ index: '' });
      this.fetchValues(); // Refresh values after submit
      this.fetchIndexes(); // Refresh seen indexes after submit
    } catch (err) {
      console.error('Failed to submit index', err);
    }
  };

  renderSeenIndexes() {
    const { seenIndexes } = this.state;

    if (!Array.isArray(seenIndexes) || seenIndexes.length === 0) return 'None';

    // If items are objects with 'number' key
    if (typeof seenIndexes[0] === 'object' && seenIndexes[0].number !== undefined) {
      return seenIndexes.map(({ number }) => number).join(', ');
    }

    // If items are just numbers
    return seenIndexes.join(', ');
  }

  renderValues() {
    const { values } = this.state;
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    if (entries.length === 0) return <div>No values calculated yet.</div>;
    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button type="submit">Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        <p>{this.renderSeenIndexes()}</p>

        <h3>Calculated Values:</h3>
        <div>{this.renderValues()}</div>
      </div>
    );
  }
}

export default Fib;