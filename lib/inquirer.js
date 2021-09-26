const inquirer = require('inquirer')

module.exports = {
  chooseCategory: () => {
    const categoryPrompt = [{
      name: 'category',
      message: '\n ᕕ(⌐■_■)ᕗ ♪♬ \n What can I help you with?',
      type: 'list',
      choices: [
        'Simulate User Input'
      ]
    }]
    return inquirer.prompt(categoryPrompt)
  },

  chooseLifecycle: () => {
    const lifecyclePrompt = [{
      name: 'lifecycle',
      message: '',
      type: 'list',
      choices: [
        'Session/Slot states',
        'Creators/Supporters',
      ]
    }]
    return inquirer.prompt(lifecyclePrompt)
  },

  chooseState: () => {
    const statePrompt = [{
      name: 'state',
      message: 'Choose the status update you would like to perform:',
      type: 'list',
      choices: [
        'Session: potential -> published',
        'Slot: published -> holding, non-MF'
      ]
    }]
    return inquirer.prompt(statePrompt)
  }
}
