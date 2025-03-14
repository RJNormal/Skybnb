import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import SpotList from './components/SpotList/SpotList';
import SpotDetails from './components/SpotDetails/SpotDetails';
import * as sessionActions from './store/sessions';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />} 
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <>
            <h1>The Sky is the Limit at Skybnb!</h1>
            <SpotList /> 
          </>
        ),
       
      },
      { path: "/spots/:spotId", 
        element: <SpotDetails /> }
    ], 
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;