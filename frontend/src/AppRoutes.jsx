import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Public route */}
            <Route path="/" element={<LandingPage />} />
           

            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
