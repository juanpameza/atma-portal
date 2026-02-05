// This page is rendered on the server side and uses Suspense to load the PlansClient component.

import { Suspense } from "react";
import PlansClient from "./PlansClient";

export default function PlansPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-neutral-600">
          Loading plans…
        </div>
      }
    >
      <PlansClient />
    </Suspense>
  );
}