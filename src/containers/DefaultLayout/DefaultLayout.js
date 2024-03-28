import { AppBreadcrumb2 as AppBreadcrumb, AppHeader, AppSidebar, AppSidebarMinimizer, AppSidebarNav2 as AppSidebarNav } from '@coreui/react';
import React, { Component, Suspense } from 'react';
import * as router from 'react-router-dom';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Container } from 'reactstrap';
import routes from '../../routes';
import menuitems from '../../_nav.js';
import './style.css';
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
class DefaultLayout extends Component {
  state = {
    menus: menuitems
  }
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  componentDidMount() {
    if (localStorage.getItem('loggedin')!=="user@gmail.com") {
      this.props.history.push("/login");
    }
  }

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }
  render() {
    return (
      <div className="app">
        <ToastContainer />
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader history={this.props.history} onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <Suspense>
              <AppSidebarNav navConfig={this.state.menus} {...this.props} router={router} />
            </Suspense>
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main" id="mainstyle" >
            <AppBreadcrumb appRoutes={routes} router={router} />
            <Container fluid>
              <Card className='cardoveralsize'>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <route.component {...props} />
                          )} />
                      ) : (null);
                    })}
                    <Redirect from="/" to="/dashboard" />
                  </Switch>
                </Suspense>
              </Card>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}
export default DefaultLayout;
