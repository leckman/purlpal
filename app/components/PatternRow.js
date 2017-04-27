import React from 'react';
import { connect } from 'react-redux'
import Messages from './Messages';

class PatternRow extends React.Component {

  renderRow(row) {
    return <Row value={row} />;
  }

  render() {
    let users = [];
    let that = this;
    this.state.users.forEach(function(user, i) {
      users.push(<div className='panel'>{that.renderThree(subset)}</div>);
    });

    return (
      <div className="container">
        {users}
      </div>
    );
  }
  render() {
    return (
      <div className="container-fluid">
        <Messages messages={this.props.messages}/>
        <div className="row">
          <div className="col-sm-4">
            <div className="panel">
              <div className="panel-body">
                <h3>Pattern 1 Goes Here</h3>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="panel">
              <div className="panel-body">
                <h3>Pattern 2 Goes Here</h3>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="panel">
              <div className="panel-body">
                <h3>Pattern 3 Goes Here</h3>
              </div>
            </div>
          </div>
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
