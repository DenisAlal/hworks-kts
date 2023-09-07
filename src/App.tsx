import * as React from "react"
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from "./components/Header";

import {AppContextProvider} from "./context/App.context.tsx";
import AboutTab from "./pages/About/AboutTab.tsx";
import CategoryTab from "./pages/Category/CategoryTab.tsx";
import ProductsTab from "./pages/Products/ProductsTab.tsx";
import ProductPage from "./pages//Products/ProductPage/ProductPage.tsx";
const App: React.FC = () => {
    return (
        <AppContextProvider>
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<ProductsTab/>}/>
                <Route path="/:id" element={< ProductPage/>} />
                <Route path="/categories" element={<CategoryTab/>} />

                <Route path="/about" element={<AboutTab />} />
            </Routes>
        </BrowserRouter>
        </AppContextProvider>
    )
}

export default App
