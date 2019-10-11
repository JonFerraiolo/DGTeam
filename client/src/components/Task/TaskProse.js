
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import TaskStepBaseClass from './TaskStepBaseClass'
import './TaskProse.css'

class TaskProse extends TaskStepBaseClass {

  render() {
    let { content } = this.props
    setTimeout(() =>{
      this.props.onStepComplete() // Tell TaskWizard ok to activate Next button
    }, 0)
    return (
      <div className="TaskProse" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}} />
    );
  }
}

TaskProse.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  onStepComplete: PropTypes.func.isRequired,
  onStepAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired,
  hideShowWizardNavigation: PropTypes.func.isRequired
}

export default withRouter(TaskProse);
