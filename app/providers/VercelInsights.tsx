"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const AnalyticsComponent = dynamic(() => import("@vercel/analytics/react").then((m) => m.Analytics), { ssr: false });
const SpeedInsightsComponent = dynamic(() => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights), {
  ssr: false,
});

export function VercelInsights() {
  return (
    <Suspense fallback={null}>
      <AnalyticsComponent />
      <SpeedInsightsComponent />
    </Suspense>
  );
}
