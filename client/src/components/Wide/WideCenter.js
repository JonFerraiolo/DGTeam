
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Icon, Menu } from 'semantic-ui-react'
import Tasks from '../Workbench/Tasks'
import Inbox from '../Inbox/Inbox'
import InboxMessage from '../Inbox/InboxMessage'
import TaskWizard from '../../containers/TaskWizard'
import { getPathRootFromUrl, getIconFromPageName, getLabelFromPageName } from '../../util/workbenchPages'
import MoreMenu from '../Workbench/MoreMenu'
import './WideCenter.css'

class WideCenter extends React.Component {

  handleItemClick = (e, { name }) => {
    this.props.history.push('/'+name)
  }

  render() {
    let pathRoot = getPathRootFromUrl()
    let activePage = pathRoot
    let highlightedPage = pathRoot
    let { store } = this.props
    let center = <div>FIXME</div>
    switch (activePage) {
      case "Tasks":
        center = <Tasks store={store} />
        break
      case "Messages":
        let { id } = (this.props.match && this.props.match.params) || {}
        if (id) {
          center = <InboxMessage store={store} id={id} />
        } else {
          center = <Inbox store={store} />
        }
        break
      case "Task":
        let { level, name } = (this.props.match && this.props.match.params) || {}
        if (!level || !name ) {
          console.error('WideCenter Task missing level:'+level+' or name:'+name)
          this.props.history.push('/systemerror')
        }
        center = <TaskWizard store={store} level={level} name={name} />
        activePage = highlightedPage = 'Tasks'
        break
      case "Me":
      case "Search":
      default:
    }
    return (
      <div className="WideCenter">
        <div className="WideCenterPrimaryMenu">
          <Menu icon='labeled' >
            <Menu.Item name='Tasks' active={highlightedPage === 'Tasks'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Tasks')} />
              {getLabelFromPageName('Tasks')}
            </Menu.Item>
            <Menu.Item name='Messages' active={highlightedPage === 'Messages'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Messages')} />
              {getLabelFromPageName('Messages')}
            </Menu.Item>
            <Menu.Item name='Search' active={highlightedPage === 'Search'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Search')} />
              {getLabelFromPageName('Search')}
            </Menu.Item>
            <Menu.Item name='Me' active={highlightedPage === 'Me'} onClick={this.handleItemClick}>
              <Icon name={getIconFromPageName('Me')} />
              {getLabelFromPageName('Me')}
            </Menu.Item>
            <MoreMenu store={store} />
          </Menu>
        </div>
        <div className="WideCenterContent">
          {center}
        </div>
      </div>
    );
  }
}

WideCenter.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(WideCenter);
