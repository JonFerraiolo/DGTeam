
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Checkbox, Icon, Message } from 'semantic-ui-react'
import TaskStepBaseClass from './TaskStepBaseClass'
import './TaskTrueFalse.css'

class TaskTrueFalse extends TaskStepBaseClass {
  constructor(props) {
    super(props)
    this.state = {
      questions: JSON.parse(JSON.stringify(this.props.content.questions)),
      score: 'notyet'
    }

  }

  handleChange = (e, { name, value }) => {
    var index = name-0 // convert to number
    let questions = JSON.parse(JSON.stringify(this.state.questions))
    questions[index].value = value
    this.setState({ questions })
  }

  checkAnswers = (e) => {
    let { questions } = this.state
    let anyWrong = questions.some(question => question.value !== question.a.toString())
    if (!anyWrong) {
      this.props.onStepComplete() // Tell TaskWizard ok to activate Next button
    }
    this.setState({ score: anyWrong ? 'fail' : 'pass' })
  }

  tryAgain = (e) => {
    let questions = JSON.parse(JSON.stringify(this.state.questions))
    questions.forEach(question => { question.value = null })
    this.setState({ score: 'notyet', questions })
  }

  scrollButtonIntoView = () => {
    setTimeout(() =>{
      let TaskTrueFalseButtonRow = document.querySelector('.TaskTrueFalseButtonRow')
      if (TaskTrueFalseButtonRow) {
        TaskTrueFalseButtonRow.scrollIntoView()
      }
    }, 20)
  }

  render() {
    let { questions, score } = this.state
    let notAllAnswered = questions.some(question => typeof question.value !== 'string')
    let scoreStyle = score !== 'notyet' ? { visibility: 'visible' } : { visibility: 'hidden' }
    let disableRadios = (score !== 'notyet')
    let rows = []
    let count = 1
    questions.map((item, index) => {
      rows.push( <div key={(count++).toString()} className="TaskTrueFalseNumber">{index+1}</div> )
      rows.push( <div key={(count++).toString()} className="TaskTrueFalseQuestion">{item.q}</div> )
      rows.push( <label key={(count++).toString()} className="TaskTrueFalseTrue">
        <div className="TaskTrueFalseTrueLabel">True</div>
        <Checkbox radio name={index.toString()} value='true' checked={item.value === 'true'} disabled={disableRadios} fitted={false} onChange={this.handleChange} />
      </label> )
      rows.push( <label key={(count++).toString()} className="TaskTrueFalseFalse">
        <div className="TaskTrueFalseFalseLabel">False</div>
        <Checkbox radio name={index.toString()} value='false' checked={item.value === 'false'} disabled={disableRadios} fitted={false} onChange={this.handleChange} />
      </label> )
      let boolValue = item.value === 'true' ? true : (item.value === 'false' ? false : null)
      let correct = boolValue === item.a
      let icon = correct ? 'check circle' : 'remove circle'
      rows.push( <div key={(count++).toString()} className="TaskTrueFalseScore"> <Icon style={scoreStyle} key={(count++).toString()} name={icon} size='large' /> </div> )
      return null
    })
    let buttonRow
    if (!notAllAnswered && score === 'notyet') {
      buttonRow = <Button className="CheckAnswers" onClick={this.checkAnswers} >Check my answers</Button>
      this.scrollButtonIntoView()
    } else if (score === 'fail') {
      buttonRow = <Button className="TryAgain" onClick={this.tryAgain} >Try again</Button>
      this.scrollButtonIntoView()
    } else if (score === 'pass') {
      buttonRow = ( <Message className="Congrats">
          <Message.Header>Congratulations!</Message.Header>
          <p>Please press one of the navigation buttons below to proceed.</p>
        </Message> )
      this.scrollButtonIntoView()
    }
    return (
      <div className="TaskTrueFalse" >
        <div className="TaskTrueFalseQuestions" >
          {rows}
        </div>
        <div className="TaskTrueFalseButtonRow">
          {buttonRow}
        </div>
      </div>
    );
  }
}

TaskTrueFalse.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired,
  onStepComplete: PropTypes.func.isRequired,
  onStepAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired,
  hideShowWizardNavigation: PropTypes.func.isRequired
}

export default withRouter(TaskTrueFalse);
