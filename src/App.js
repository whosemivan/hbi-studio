import React from 'react';
import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';
import browserHistory from "./browser-history";

import Header from './components/Header';
import AuditsTable from './components/AuditsTable';
import RefAcTable from './components/RefAcTable';
import RefVatTable from './components/RefVatTable';
import NotFound from './components/NotFound';

function App() {
  return (
    <>
      <BrowserRouter history={browserHistory}>
        <Switch>
          <Route exact path='/'>
            <Header />
            <AuditsTable />
          </Route>
          <Route exact path='/refAc'>
            <Header />
            <RefAcTable />
          </Route>
          <Route exact path='/refVat'>
            <Header />
            <RefVatTable />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
