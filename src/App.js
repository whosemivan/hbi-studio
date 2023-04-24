import React, { useState } from 'react';
import { Switch, Route, Router as BrowserRouter } from 'react-router-dom';
import browserHistory from "./browser-history";

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

import Header from './components/Header';
import AuditsTable from './components/AuditsTable';
import RefAcTable from './components/RefAcTable';
import RefVatTable from './components/RefVatTable';
import RefVatArmTable from './components/RefVatArmTable'
import Jobs from './components/Jobs';
import NotFound from './components/NotFound';

import { ConfigProvider } from 'antd';


function App() {
  const [isAuth, setAuth] = useState(localStorage.getItem("accessToken"));

  return (
    <>
      <ConfigProvider theme={{
        token: {
          colorPrimary: '#00657f',
        },
      }}>
        <BrowserRouter history={browserHistory}>
          <Switch>
            <Route exact path='/'>
              <SignIn isAuth={isAuth} setAuth={setAuth} />
            </Route>
            <Route exact path='/signup'>
              <SignUp isAuth={isAuth} setAuth={setAuth} />
            </Route>
            <Route exact path='/audits'>
              <Header isAuth={isAuth} setAuth={setAuth} />
              <AuditsTable />
            </Route>
            <Route exact path='/refAc'>
              <Header isAuth={isAuth} setAuth={setAuth} />
              <RefAcTable isAuth={isAuth} />
            </Route>
            <Route exact path='/refVat'>
              <Header isAuth={isAuth} setAuth={setAuth} />
              <RefVatTable isAuth={isAuth}  />
            </Route>
            <Route exact path='/refVatArm'>
              <Header isAuth={isAuth} setAuth={setAuth} />
              <RefVatArmTable isAuth={isAuth}  />
            </Route>
            <Route exact path='/jobs'>
              <Header isAuth={isAuth} setAuth={setAuth} />
              <Jobs />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </BrowserRouter>
      </ConfigProvider>
    </>
  );
}

export default App;
