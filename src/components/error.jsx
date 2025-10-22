import { AlertCircle } from "lucide-react";

const Error = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 text-red-400 text-sm ${className}`}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default Error;