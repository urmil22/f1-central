import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home/Home";
import RootLayout from "./layout/RootLayout";
import Drivers from "./pages/Drivers/Drivers";
import Constructors from "./pages/Constructors/Constructors";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "drivers", element: <Drivers /> },
      { path: "constructors", element: <Constructors /> },
      // { path: "drivers/:driverId", element: <DriverDetails /> },
      // { path: "calendar", element: <RaceCalendar /> },
      // { path: "races/:raceId", element: <RaceDetails /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
