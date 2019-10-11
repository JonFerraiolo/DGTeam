
import React from 'react';
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import PropTypes from 'prop-types'
import WideLayout from '../components/Wide/WideLayout'
import ThinLayout from '../components/Thin/ThinLayout'
import './Workbench.css'

class Workbench extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //password: ''
    }
  }

  render() {
    let { store } = this.props
    return (
      <div className="Workbench">
        <MediaQuery minWidth={1024}>
          <WideLayout store={store} showRightColumn={true}  />
        </MediaQuery>
        <MediaQuery minWidth={250} maxWidth={1023}>
          <WideLayout store={store} showRightColumn={false}  />
        </MediaQuery>
        <MediaQuery maxWidth={249}>
          <ThinLayout store={store} />
        </MediaQuery>
      </div>
    );
  }
}

Workbench.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(Workbench);
