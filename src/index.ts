import { loadEntry, loadEntryContent, appendAssets } from './handleAssets';

type rootType = string | getRootElement | HTMLElement;

interface getRootElement {
  (): HTMLElement;
}

// record rootElement for unmount
let root;

/**
 * Get rootElement, deal with string | function | HTMLElement
 */
export function getRoot(rootElement: rootType): HTMLElement {
  if (!rootElement) {
    throw new Error('dynamicLoader: rootElement is required!');
  }

  if (typeof rootElement === 'string') {
    return document.getElementById(rootElement);
  }

  if (typeof rootElement === 'function') {
    return rootElement();
  }

  return rootElement;
}

export async function mount(
  rootElement: rootType,
  entry: string | string[],
  rootId: string = 'dyloader',
) {
  root = getRoot(rootElement);

  // create wapper element
  const wrapper = document.createElement('div');
  wrapper.setAttribute('id', rootId);
  root.appendChild(wrapper);

  // create assetsWrapper for append assets
  const assetsWrapper = document.createElement('div');
  assetsWrapper.setAttribute('id', 'dyloader-assets');
  root.appendChild(assetsWrapper);

  if (typeof entry === 'string') {
    // string treated as html entry
    if (entry.indexOf('<head>') === -1) {
      // no <head> -> htmlUrl
      await loadEntry(wrapper, entry);
    } else {
      // has <head> -> htmlContent
      await loadEntryContent(wrapper, entry, location.href);
    }
  } else if (Array.isArray(entry)) {
    await appendAssets(assetsWrapper, entry);
  } else {
    throw new Error('dynamicLoader: entry is required and must be string or array!');
  }
}

export function unmount() {
  root.innerHTML = '';
  root = null;
}
