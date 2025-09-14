import { BrowserRouter, Route, Routes } from "react-router";

import DirectoryPage from "./pages/DirectoryPage";
import MainLayout from "./pages/layouts/MainLayout";
import { CommandContextProvider } from "./contexts/CommandContext";

import "./App.css";

function App() {
  return (
    <CommandContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index path="*" element={<DirectoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CommandContextProvider>
  );
}

export default App;
