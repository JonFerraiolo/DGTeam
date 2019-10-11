
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'
import './WideLeft.css'

class WideLeft extends React.Component {

  handleItemClick = (e, { name }) => {
    this.props.history.push('/'+name)
  }

  render() {
    return (
      <div className="WideLeft">
        <Menu icon='labeled' vertical>
          <Menu.Item className="teamlogomenuitem" name='teamlogo' active={false} onClick={this.handleItemClick}>
            <i className="icon"><span className="logotext">Logo</span></i>
            &nbsp;
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

WideLeft.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(WideLeft);
