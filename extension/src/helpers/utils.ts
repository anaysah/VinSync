function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function getJSPath(element) {
  if (!element) return; // If element is not provided

  let path = '';
  const pathSegments = [];

  while (element) {
      let selector = getElementSelector(element);
      pathSegments.unshift(selector);
      element = element.parentElement;
  }

  path = pathSegments.join(' > ');
  return path;
}

function getElementSelector(element) {
  if (!element) return '';

  let selector = '';
  const id = element.id;
  const classes = Array.from(element.classList).join('.');
  const tagName = element.tagName.toLowerCase();

  if (id) {
      selector = `#${id}`;
  } else if (classes) {
      selector = `${tagName}.${classes}`;
  } else {
      selector = tagName;
  }

  return selector;
}

export { getCurrentTime, getJSPath }