const langmap = {
  c: 50,
  cpp: 54,
  python: 92,
  javascript: 63,
  java: 91,
};

async function getsubmit(tokenid) {
  const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenid}?base64_encoded=true&fields=*`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '1c239680femsh8a095d671b7482ap16d681jsnbfeb31e51c47',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch submission: ${error.message}`);
  }
}

export async function makesubmission({ code, lang, callback, stdin }) {
  const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': '1c239680femsh8a095d671b7482ap16d681jsnbfeb31e51c47',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language_id: langmap[lang],
      source_code: btoa(code),
      stdin: btoa(stdin),
    }),
  };

  try {
    callback({ apistatus: 'loading' });
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    const tokenid = result.token;

    let statuscode = 1;
    let apiresult;

    while (statuscode === 1 || statuscode === 2) {
      try {
        apiresult = await getsubmit(tokenid);
        if (!apiresult || !apiresult.status) {
          throw new Error('Invalid API response');
        }
        statuscode = apiresult.status.id;
      } catch (error) {
        callback({ apistatus: 'error', message: error.message });
        return;
      }
    }

    if (apiresult) {
      callback({ apistatus: 'success', data: apiresult });
    }
  } catch (error) {
    callback({
      apistatus: 'error',
      message: error.message,
    });
  }
}
