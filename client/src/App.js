import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { pubRoutes } from "./Routes/public_route";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {pubRoutes.map((item, index) => {
          const Layout =
            item.layout === null
              ? React.Fragment
              : item.layout === undefined
              ? "DefaultLayout"
              : item.layout;
          return (
            <Route
              key={index}
              path={item.path}
              element={
                <Layout>
                  <item.element />
                </Layout>
              }
            ></Route>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
