import { reformatUri } from '../functions';

const fetchResource = async ({ uri, additionalHeaders }) => {
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      Accept: 'application/ld+json',
      ...additionalHeaders
    }
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`${response.statusText} fetch error: ${response.statusText}`);
  }
};

export default fetchResource;
