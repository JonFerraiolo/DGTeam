
import React from 'react';
import PropTypes from 'prop-types'

class TaskStepBaseClass extends React.Component {
  render() {
    return (<span></span>)
  }
}

TaskStepBaseClass.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onStepComplete: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired,
  hideShowWizardNavigation: PropTypes.func.isRequired
}

export default TaskStepBaseClass;
