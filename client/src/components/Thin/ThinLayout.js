
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import './ThinLayout.css'

class ThinLayout extends React.Component {
  render() {
    let { store } = this.props
    return (
      <div className="ThinLayout">
        <div>ThinLayout</div>
      </div>
    );
  }
}

ThinLayout.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(ThinLayout);
