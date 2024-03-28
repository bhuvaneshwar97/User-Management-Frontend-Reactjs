import React from 'react';
const UsersList = React.lazy(() => import('./components/Users/Users'));
const CreateUser = React.lazy(() => import('./components/Users/CreateUser'));
const DeletedUsers = React.lazy(() => import('./components/Users/DeletedUsers'));
const SearchUser = React.lazy(()=> import('./components/Users/SearchUser'));

const routes = [
  { path: '/home', exact: true, name: 'Home', component: UsersList },
  { path: '/home/:id', exact: true, name: 'Home', component: CreateUser },
  { path: '/searchuser', exact: true, name: 'Search User', component: SearchUser },
  { path: '/adduser/:id', exact: true, name: 'Add User', component: CreateUser },
  { path: '/deletedusers', exact: true, name: 'Deleted Users', component: DeletedUsers },
];
export default routes;