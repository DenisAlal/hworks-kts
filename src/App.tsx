import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "components/Header";
import {aboutPath, categoriesPath, productsPath} from "config/pathLinks.ts";
import { AppContextProvider } from "context/App.context.tsx";
import AboutTab from "pages/About/AboutTab.tsx";
import CategoryTab from "pages/Category/CategoryTab.tsx";
import ProductPage from "pages/ProductPage/ProductPage.tsx";
import ProductsTab from "pages/Products/ProductsTab.tsx";



const App: React.FC = () => {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path={productsPath} element={<ProductsTab />} />
          <Route path={productsPath + ":id"} element={<ProductPage />} />
          <Route path={categoriesPath} element={<CategoryTab />} />
          <Route path={aboutPath} element={<AboutTab />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
};

export default App;
