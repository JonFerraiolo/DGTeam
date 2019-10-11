
//   title: 'Your Oaths'
module.exports = {
  steps: [
    {
      type: 'TaskProse',
      title: '',
      content: `
        <p>An oath is a promise about future behavior.</p>

        <p>To participate as a member of the Democracy Guardians team, you must commit to a series of oaths regarding your behavior when engaged in any Democracy Guardians activities.</p>

        <p>The following pages contain <strong>Democracy Guardians' Basic Oaths</strong>. Press "Next" to proceed.</p>
`
    },
    {
      type: 'TaskConfirmOath',
      title: 'Oath',
      content: 'I promise to be honest and trustworthy in all my activities with this organization.'
    },
    {
      type: 'TaskConfirmOath',
      title: 'Oath',
      content: 'I promise to be be thoughtful and open-minded in all my activities with this organization where I recognize that different people have different points of view and that another person\'s opinions are just as valid as mine.'
    }
  ]
}
