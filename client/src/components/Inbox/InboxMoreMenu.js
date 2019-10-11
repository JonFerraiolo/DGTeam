
import React from 'react'
import { Icon, Menu, Popup } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import './InboxMoreMenu.css'

class InboxMoreMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  handleOpen = () => {
    this.setState({ isOpen: true })
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  handleItemClick = (e, { name }) => {
    this.setState({ isOpen: false })
    if (name === 'logout') {
      //this.logout()
    } else {
      alert('FIXME not yet implemented')
    }
  }

  render() {
    let hidden = { visibility: 'hidden' }
    let showallStyle = { visibility: 'visible' }
    let showunreadonlyStyle = { visibility: 'hidden' }
    let showreadonlyStyle = { visibility: 'hidden' }
    let InboxMoreMenuPopup = () => (
      <Menu className='InboxMoreMenu' icon='labeled' vertical>
        <Menu.Item>
          <Menu.Menu>
            <Menu.Item name='showall' onClick={this.handleItemClick} >
              <Icon name='check' style={showallStyle} />
              Show all
            </Menu.Item>
            <Menu.Item name='showunreadonly' onClick={this.handleItemClick} >
              <Icon name='check' style={showunreadonlyStyle} />
              Show unread entries only
            </Menu.Item>
            <Menu.Item name='showreadonly' onClick={this.handleItemClick} >
              <Icon name='check' style={showreadonlyStyle} />
              Show read entries only
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          <Menu.Menu>
            <Menu.Item name='markAsRead' onClick={this.handleItemClick} >
              <Icon name='check' style={hidden} />
              Mark selected as read
            </Menu.Item>
            <Menu.Item name='markAsUnread' onClick={this.handleItemClick} >
              <Icon name='check' style={hidden} />
              Mark selected as unread
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    )

    return (
      <Popup basic position='bottom right' on="click" className="InboxMoreMenuPopup"
        open={this.state.isOpen}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        trigger={<Menu.Item name='InboxMoreMenu' position='right' >
          <Icon name='dropdown' size='large' inverted />
        </Menu.Item>}
        content={<InboxMoreMenuPopup/>}
      />
    )
  }
}

export default withRouter(InboxMoreMenu)
