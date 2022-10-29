import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "./Default/Layout/DefaultLayout";
import { pubRoutes } from "./Routes/PublicRoutes";
import Login from "./components/Login/index"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {pubRoutes.map((route, index) => {
          const Layout =
            route.layout === null
              ? React.Fragment
              : route.layout === undefined
              ? DefaultLayout
              : route.layout;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <route.element />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
