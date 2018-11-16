import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';

import stateRoot from './reducers';
import { nextScreen } from './actions/game.js';
import { logout, tryPull } from './actions/app.js';
import { APP_UI_AWAIT, APP_UI_AUTH, APP_UI_FETCH_ERROR, APP_UI_GAME } from './reducers/app.js';

import AuthView from './AuthView.js';
import GameView from './GameView.js';
import MobileGameView from './MobileGameView.js';

let store;

if (process.env.NODE_ENV === "production")
  store = createStore(stateRoot, applyMiddleware(ReduxThunk));
else {
  store = createStore(stateRoot, composeWithDevTools(applyMiddleware(ReduxThunk)));

  const devUrlScreen = new URL(window.location.href).searchParams.get('screen');
  devUrlScreen && store.dispatch(nextScreen(devUrlScreen));
}

store.dispatch(tryPull());

class App extends Component {
  isMobile() {
    return window.matchMedia("(max-width: 600px)").matches;
  }

  render() {
    switch (this.props.screen) {
      case APP_UI_AWAIT:
        return <section>Loading...</section>;
      case APP_UI_AUTH:
        return <AuthView />;
      case APP_UI_GAME:
        return this.isMobile() ?
          <MobileGameView onLogout={() => this.props.dispatchLogout()} /> :
          <GameView onLogout={() => this.props.dispatchLogout()} />;
      case APP_UI_FETCH_ERROR:
        return <section>Error</section>;
    }
  }
}

const mapStateToProps = ({ app: { ui }}) => ({ screen: ui });
const mapDispatchToProps = (dispatch) => ({
  dispatchLogout: () => dispatch(logout())
});

const AppView = connect(mapStateToProps, mapDispatchToProps)(App)

render(<Provider store={store}><AppView /></Provider>, document.body);
