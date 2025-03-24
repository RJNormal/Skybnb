import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import SpotList from './components/SpotList/SpotList';
import SpotDetails from './components/SpotDetails/SpotDetails';
import * as sessionActions from './store/sessions';
import CreateSpot from './components/CreateSpot/CreateSpot';
import ManageSpots from './components/SpotManagement/ManageSpots';
import ManageReviews from './components/ReviewManagement/ManageReviews';



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
        element: <SpotDetails /> },
        { path: "/spots/new", 
        element: <CreateSpot/> },
        { path: "/spots/manage",
        element: <ManageSpots/> },
        {path: "/reviews/manage",
         element: <ManageReviews />  }
    ], 
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;