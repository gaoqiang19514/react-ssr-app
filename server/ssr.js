import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../src/App';

const app = express();

// 改成非html的可行吗
app.get(/\.(js|json|css|map|ico|svg|png)$/, express.static(path.resolve(__dirname, '../build')));

app.use('*', async (req, res) => {
  const componentData = {};

  let indexHTML = fs.readFileSync(path.resolve(__dirname, '../build/index.html'), {
    encoding: 'utf8',
  });
  let appHTML = renderToString(<App />);

  indexHTML = indexHTML.replace('<div id="root"></div>', `<div id="app">${appHTML}</div>`);

  indexHTML = indexHTML.replace('var initial_state = null;', `var initial_state = ${JSON.stringify(componentData)};`);

  res.contentType('text/html');
  res.status(200);

  return res.send(indexHTML);
});

app.listen('9000', () => {
  console.log('Express server started at http://localhost:9000');
});
