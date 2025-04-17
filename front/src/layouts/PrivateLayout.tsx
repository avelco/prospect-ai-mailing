import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useSessionStore } from "../stores/authStore"; // adjust path as needed
import { LoaderSpinner } from "../components/LoaderSpinner";

export const PrivateLayout = () => {
  const accessToken = useSessionStore((state) => state.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login", { replace: true });
    }
  }, [accessToken, navigate]);

  if (!accessToken) return <LoaderSpinner />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
