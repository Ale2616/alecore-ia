import handler from './api/v1/chat/completions.js';

const req = {
  method: 'POST',
  headers: {
    authorization: 'Bearer fake-key'
  },
  body: {
    model: 'meta/llama-3.1-70b-instruct',
    messages: [{ role: 'user', content: 'hello' }]
  }
};

const res = {
  setHeader: (key, value) => console.log('SetHeader:', key, value),
  status: (code) => {
    console.log('Status:', code);
    return {
      json: (data) => console.log('JSON:', data),
      end: () => console.log('End')
    };
  }
};

handler(req, res).catch(console.error);
