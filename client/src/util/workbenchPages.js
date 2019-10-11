
const pageNameXref = {
  Tasks: { icon: 'checkmark box', label: 'Tasks' },
  Messages: { icon: 'inbox', label: 'Messages' },
  Search: { icon: 'search', label: 'Search' },
  Me: { icon: 'child', label: 'Me' }
}

function getTokens() {
  let pathname = window.location.pathname
  //fixme restore let relativePath = pathname.substr(TEAM_UI_RELATIVE_PATH.length+1)
  let relativePath = pathname.substr(1)
  return relativePath.split('/')
}

/**
 * Returns the name of the first segment of the path. Often, the section of the Workbench.
 */
export function getPathRootFromUrl() {
  return getTokens()[0]
}

/**
 * Returns the name of the menu icon corresponding to the workbench page
 */
export function getIconFromPageName(pageName) {
  return pageName && pageNameXref[pageName] && pageNameXref[pageName].icon
}

/**
 * Returns the label corresponding to the workbench page
 */
export function getLabelFromPageName(pageName) {
  return pageName && pageNameXref[pageName] && pageNameXref[pageName].label
}
