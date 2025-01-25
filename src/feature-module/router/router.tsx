import React from "react";
import { Route, Routes } from "react-router-dom";
import { authRoutes, publicRoutes } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login/login";
import ProtectedRoute from "../ProtectedRoute"; // Import the ProtectedRoute component

const ALLRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Feature />}>
        {publicRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={<ProtectedRoute element={route.element} />} />
        ))}
      </Route>
      <Route element={<AuthFeature />}>
        {authRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={<ProtectedRoute element={route.element} />} />
        ))}
      </Route>
    </Routes>
  );
};

export default ALLRoutes;
