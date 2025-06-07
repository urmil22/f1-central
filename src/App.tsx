import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from './pages/Home';
import RootLayout from './layout/RootLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      // { path: "drivers", element: <Drivers /> },
      // { path: "drivers/:driverId", element: <DriverDetails /> },
      // { path: "calendar", element: <RaceCalendar /> },
      // { path: "races/:raceId", element: <RaceDetails /> },
      // { path: "constructors", element: <Constructors /> },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
