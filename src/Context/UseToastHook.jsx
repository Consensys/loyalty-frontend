import { useState } from "react";

export function useToastHook() {
  const [isToastOpen, setIsToastOpen] = useState(false);

  const handleOpenToast = () => setIsToastOpen(true);

  const handleCloseToast = () => setIsToastOpen(false);

  return { isToastOpen, handleOpenToast, handleCloseToast };
}
