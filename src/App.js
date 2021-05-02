import React from 'react';
import { Dashboard, Login, PrivateRoute , AuthWrapper, Error } from './pages';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';


function App() {

  const {isAuthenticated} = useAuth0()
  console.log(isAuthenticated);

  return (
    <AuthWrapper >
      <Router>
        <Switch>
          <PrivateRoute path="/" exact >
            <Dashboard></Dashboard>
          </PrivateRoute>
          <Route path="/login" >
            <Login />
          </Route>
          <Route path="*" >
            <Error />
          </Route>
        </Switch>
      </Router>
    </AuthWrapper>
  );
}

export default App;
