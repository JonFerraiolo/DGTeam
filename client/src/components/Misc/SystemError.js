
import React from 'react';
import { Link } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

class SystemError extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //password: ''
    }
    //this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <Container text className='SystemError verticalformcontainer'>
        <div className="systemerror">
          <h1>System Error</h1>
          <h3>Something unexpected has happened with the application.
            Perhaps the network is unavailable or the server is unavailable.
            Sorry for the inconvenience. Perhaps try to login again.
          </h3>
          <div>
            <p>Additional information about the problem might be available in the developer tools console. </p>
            <p><Link to="/login">Click here to go to the Login screen.</Link></p>
          </div>
        </div>
      </Container>
    );
  }
}

export default SystemError
