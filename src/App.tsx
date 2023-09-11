import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "components/Header";
import { AppContextProvider } from "context/App.context.tsx";
import AboutTab from "pages/About/AboutTab.tsx";
import CategoryTab from "pages/Category/CategoryTab.tsx";
import ProductPage from "pages/Products/ProductPage/ProductPage.tsx";
import ProductsTab from "pages/Products/ProductsTab.tsx";

export const productsPath = "/";
export const categoriesPath = "/categories";
export const aboutPath = "/about";

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
