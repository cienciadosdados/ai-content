"use client";

import { TabSkeleton } from "./tab-skeleton";

interface TabContentProps {
  isLoading: boolean;
  data: unknown;
  children: React.ReactNode;
}

export function TabContent({ isLoading, data, children }: TabContentProps) {
  if (isLoading) {
    return <TabSkeleton />;
  }

  if (!data) {
    return null;
  }

  return <>{children}</>;
}
