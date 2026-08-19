import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Ghost } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-8 text-neutral-400">
        <Ghost className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-neutral-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button className="bg-stone-900 hover:bg-stone-800 text-white px-8 rounded-lg h-12">
            Back to Home
          </Button>
        </Link>
        <Link to="/book">
          <Button variant="outline" className="px-8 rounded-xl h-12">
            Book Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
}
