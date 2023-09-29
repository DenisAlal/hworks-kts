import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "components/Header";
import {
  aboutPath,
  cartPath,
  categoriesPath,
  productsPath,
  profile,
} from "config/pathLinks.ts";
import { AppContextProvider } from "context/App.context.tsx";
import AboutTab from "./pages/About/AboutTab.tsx";
import Cart from "./pages/Cart/Cart.tsx";
import CategoryTab from "./pages/Category/CategoryTab.tsx";
import ProductPage from "./pages/ProductPage/ProductPage.tsx";
import ProductsTab from "./pages/Products/ProductsTab.tsx";
import Profile from "./pages/Profile/Profile.tsx";

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path={productsPath} element={<ProductsTab />} />
          <Route path={cartPath} element={<Cart />} />
          <Route path={profile} element={<Profile />} />
          <Route path={productsPath + ":id"} element={<ProductPage />} />
          <Route path={categoriesPath} element={<CategoryTab />} />
          <Route path={aboutPath} element={<AboutTab />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
};

export default App;
