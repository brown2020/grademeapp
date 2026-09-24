import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge variant="success">
        <CheckCircle2 aria-hidden />
        Completed
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge variant="danger">
        <AlertCircle aria-hidden />
        Failed
      </Badge>
    );
  }
  return (
    <Badge variant="warning">
      <Spinner className="size-3 text-current" label="Scanning" />
      Scanning
    </Badge>
  );
}
