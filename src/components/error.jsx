import { AlertCircle } from "lucide-react";

const Error = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 bg-destructive text-destructive-foreground border-2 border-foreground px-3 py-2 text-sm font-bold ${className}`}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default Error;