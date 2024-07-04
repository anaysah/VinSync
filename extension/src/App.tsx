import { Routes, Route, HashRouter } from "react-router-dom";
import Home from "./pages/Home/page";
import Room from "./pages/Room/page";
import Layout from "./layout";

const routes = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
  },
  {
    path: "/room",
    name: "Room",
    element: <Room />,
  },
];

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          {routes.map((route, index) => {
            const { path, element } = route;
            return <Route key={index} path={path} element={element} />;
          })}
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
