import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl bg-white border border-slate-100 shadow-sm", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("p-6 pb-0", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn("font-bold text-slate-800 text-lg", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-slate-500 mt-1", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return <div className={cn("p-6 pt-0 flex items-center", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
