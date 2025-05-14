import { Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AiFeaturesAlert() {
  return (
    <Alert className="border-0 bg-primary/10 md:my-6 rounded-lg py-2 px-4">
      <AlertDescription className="text-xs text-primary/80">
        <div className="flex items-center gap-x-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">AI features are enabled!</span>
        </div>
        Get AI-powered task descriptions, sub-task suggestions, and
        prioritization.
      </AlertDescription>
    </Alert>
  );
}
