import { Link } from "react-router-dom";
import AnimatedBorder from "../components/AnimatedBorder";

export default function NotFound() {
  return (
    <div className="w-full flex items-center justify-center bg-slate-900">
      <div className="relative w-full max-w-6xl h-[90vh] flex items-center justify-center">
        
          <div className="text-center">
            <h1 className="text-5xl font-bold">404</h1>
            <p className="mt-2 text-gray-600 mb-5">Page not found</p>
            <Link to="/" className="auth-link cursor-pointer">
              Go Home
            </Link>
          </div>
        
      </div>
    </div>
  );
}
