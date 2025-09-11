import { Route, Routes } from "react-router";

import DirectoryPage from "./pages/DirectoryPage";

import "./App.css";
import MainLayout from "./pages/layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index path="*" element={<DirectoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
