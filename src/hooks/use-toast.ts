
// This file fixes the correct import paths for toast hooks
import { toast } from "@/components/ui/toast";
import { useToast as useToastShadcn } from "@/components/ui/toast";

export const useToast = useToastShadcn;
export { toast };
