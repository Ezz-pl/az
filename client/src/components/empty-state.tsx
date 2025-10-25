import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Car, UserPlus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  showPartnerButton?: boolean;
}

export default function EmptyState({ title, description, showPartnerButton = true }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
        <Car className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {showPartnerButton && (
        <Link href="/partner-register">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            سجل كشريك معنا
          </Button>
        </Link>
      )}
    </div>
  );
}