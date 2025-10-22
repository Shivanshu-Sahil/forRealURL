import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {UrlState} from "@/context";

function RequireAuth({children}) {
  const navigate = useNavigate();

  const {loading, isAuthenticated} = UrlState();

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate("/auth");
  }, [isAuthenticated, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );

  if (isAuthenticated) return children;
}

export default RequireAuth;