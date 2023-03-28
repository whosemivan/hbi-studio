import React from 'react';
import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';
import browserHistory from "./browser-history";

import Header from './components/Header';
import AuditsTable from './components/AuditsTable';
import RefAcTable from './components/RefAcTable';
import RefVatTable from './components/RefVatTable';
import RefVatArmTable from './components/RefVatArmTable'
import Jobs from './components/Jobs';

import JobsOther from './components/JobsOther';

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
          <Route exact path='/refVatArm'>
            <Header />
            <RefVatArmTable />
          </Route>
          <Route exact path='/jobs'>
            <Header />
            <Jobs />
          </Route>
          <Route exact path='/jobsOther'>
            <Header />
            <JobsOther />
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
