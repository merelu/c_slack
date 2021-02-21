import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from '@pages/Login';
import SignUp from '@pages/SignUp';

function App() {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
}

export default App;

//pages - 서비스 페이지
//components - 짜잘 컴포넌트 (공통된 것)
//layouts - 페이지들 간에 공통 레이아웃
