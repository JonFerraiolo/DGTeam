
/**
 * Utility to perform variable substitutions.
 * Variables are surrounded by double parentheses, eg ((name))
 * Example:
 *    str='((This person)) ((smells)) bad'
 *    variables={'((This person))':{you:'You'}, '((smells))':{you:'smell'}}
 *    qualifier='you'
 *    Returns 'You smell bad'
 * Replacement strings can be recursively replaced, so regex /g isn't sufficient
 * @param {string} str  a string that might have variables
 * @param {object} variables  an associative array indexed by variable name, such as ((name))
 *                  The values are objects, associative arrays indexed by qualifier.
 *                  The values of the inner objects are the substitution strings.
 * @param {string} qualifier  second level index into variables
 * @returns the new string with variables substituted
 */
let substituteVariables = function(str, variables, qualifier) {
  for (let i=0; i<1000; i++) {
    let done = true
    str = str.replace(/\(\(([^)]+)\)\)/, function(match, p1, offset, wholeString) {
      done = false
      let substitute = (variables[match] && (variables[match][qualifier] || variables[match]['all'])) || p1
      return substitute
    })
    if (done) {
      break
    }
  }
  return str
}

export default substituteVariables
