import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import Messages from './Messages';
//import { loadPatterns } from '../actions/patterns';
var Pattern = require('../../models/Pattern');

class Patterns extends React.Component {

  constructor(props){
      super(props);
      this.state = {
        patterns: []
      };
  }

  componentDidMount(){
    console.log("Componenet Did Mount");
    //var that = this;
    //Pattern.getAllPublic(function(err, pats) {
      //console.log(this);
      //console.log(that);
      //console.log(pats.length);
      //var newState = that.state;
      //newState.patterns = pats;
      //that.setState(newState);
    //});
  }

  renderOne(pattern) {
    return (<div className="col-sm-4">
      <div className="panel">
        <div className="panel-body">
          <h3>{pattern.description}</h3>
        </div>
      </div>
    </div>);
  }

  renderThree(patternSubset) {
    let cols = []
    let that = this;
    patternSubset.forEach(function(p) {
      cols.push(that.renderOne(p));
    });
    return (
    <div className="row">
    {cols}
    </div> );
  }

  render() {
    //console.log("RENDERING");
    var rows = [];
    const that = this;
    var i = 0;
    //console.log("This.State");
    //console.log(this.state.patterns);
    while (i < that.state.patterns.length) {
      var patSubset;
      if (i+3 < that.state.patterns.length) {
        patSubset = that.state.patterns.slice(i, i+3);
      } else {
        patSubset = that.state.patterns.slice(i);
      }
      //console.log(patSubset);
      rows.push(that.renderThree(patSubset));
      i = i + 3;
    }
    return (
      <div id="app-body">
      <div id="pattern-container" className="container-fluid">
        <Messages messages={this.props.messages}/>
        {rows}
        <h1 id="heading">Fetching Patterns...</h1>
      </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Patterns);
