'use strict';
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var Router = require('react-router');
var History = require('history');
var Routes = require('../components/Routes');

module.exports = function(url, cb) {
  const history = History.createMemoryHistory();
  const location = history.createLocation(url);

  Router.match({
      routes: Routes,
      location: location
    },
    function(error, redirectLocation, renderProps) {
      if(error) {
        return cb(error);
      }

      if(!renderProps) {
        console.warn('staticPage - missing render props!', url);
      }

      cb(
        null,
        ReactDOMServer.renderToStaticMarkup(<Router.RouterContext {...renderProps} />)
      );
    }
  );
};
