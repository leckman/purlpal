import React from 'react';
import { connect } from 'react-redux'
import Messages from './Messages';
import Patterns from './Patterns';

class Home extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <Messages messages={this.props.messages}/>
        <Patterns/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Home);
