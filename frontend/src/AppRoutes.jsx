import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SearchPage from "./pages/SearchPage"; // Assuming SearchPage needs to be included


const AppRoutes = () => {
    return (
        <Routes>
            {/* Public route */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/searchPage" element={<SearchPage />} />

            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
