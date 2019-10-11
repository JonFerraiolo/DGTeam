
var fs = require('fs');
var _eval = require('eval');
var profileCategories = require('./profileCategories');

var profileTypes = profileCategories.profileTypes;
var profileQualifiers = profileCategories.profileQualifiers;

var useCache = false; // should be true for production releases
var cache = {};

module.exports = ((level, name) => {
  return new Promise((resolve, reject) => {
    let taskPath = './Tasks/'+level+'/'+name+'.js';
    console.log('taskPath='+taskPath);
    if (cache[taskPath]) {
      console.log('gettask. using cache. task='+JSON.stringify(cache[taskPath]));
      resolve(JSON.parse(JSON.stringify(cache[taskPath])));
      return;
    }
    let task = { success: false };
    fs.readFile(taskPath, 'utf8', function (err, data) {
      if (err) {
        reject('unable to load module='+taskPath);
      } else {
        var task = _eval(data);
        task.success = true;
        let steps = task.steps;
        // Expand any instances of TaskYourProfileWizard, TaskPersonProfileWizard or TaskOrgProfileWizard
        let nSteps = steps.length;
        for (let i=nSteps-1; i>=0; i--) {
          let stepItem = steps[i];
          let type = stepItem.type;
          let index = profileTypes.indexOf(type);
          if (index >= 0) {
            steps.splice(i, 1);
            let arr;
            if (type === 'TaskOrgProfileWizard') {
              arr = profileCategories.org;
            } else {
              arr = profileCategories.person;
            }
            for (let j=0; j<arr.length; j++)  {
              steps.splice(i+j, 0, { type:'TaskProfile', content: { qualifier:profileQualifiers[index], index:j }});
            }
          }
        }
        if (useCache)  {
          cache[taskPath] = JSON.parse(JSON.stringify(task));
        }
        console.log('gettask. task='+JSON.stringify(task));
        resolve(task);
      }
    });
  });
});
