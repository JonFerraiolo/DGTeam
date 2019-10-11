
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import { Feed, Icon, Menu } from 'semantic-ui-react'
import './InboxMessage.css'

let notifications = [
  {
    id: '1',
    when: '3 hours ago',
    subject: 'Welcome!',
    from: '(automatically generated)',
    content: `
<h3>Welcome to the Democracy Guardians team!</h3>
<p>With the team application, you start out at level 1.
  As you learn and develop skills, you advance to higher levels. </p>
<p>To complete Level 1 and advance to level 2, you must complete the following three training modules:</p>
<ul class="AppTaskList">
  <li><a href="/Task/1/Trustworthiness" class="AppTaskPressmeHighlight">Introducing Trustworthiness - Press here to start</a></li>
  <li>Confirming Your Oaths</li>
  <li>Filling Out Your Profile</li>
</ul>
    `
  }
]

let getItem = ((arr, id) => {
  return arr.find(item => item.id === id)
})

class InboxMessage extends React.Component {

  handleBackIconClick = (index, e) => {
    this.props.history.push('/Inbox')
  }

  handleDeleteIconClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  render() {
    let {id} = this.props
    let item = getItem(notifications, id)
    return (
      <div className="InboxMessage">
        <div className="InboxMessageMenu SecondaryMenu">
          <Menu secondary >
            <Menu.Item name='back' onClick={this.handleBackIconClick} fitted={false} >
              <Icon name='chevron left' size='large' inverted />
            </Menu.Item>
            <Menu.Item name='delete' onClick={this.handleDeleteIconClick} fitted={false} >
              <Icon name='delete' size='large' inverted />
            </Menu.Item>
          </Menu>
        </div>
        <Feed>
          <Feed.Event>
            <Feed.Content>
              <Feed.Summary>
                <Feed.Date dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.when)}} />
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.subject)}} />
              </Feed.Summary>
              <Feed.Extra text>
                <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.content)}} />
              </Feed.Extra>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </div>
    );
  }
}

InboxMessage.propTypes = {
  store: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
}

export default withRouter(InboxMessage);
