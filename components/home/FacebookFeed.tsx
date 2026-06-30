'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

export default function FacebookFeed() {
  useEffect(() => {
    // Parse Facebook embed after component mounts
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div className="rounded-[2rem] border border-white/15 bg-slate-950/30 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center justify-center min-h-[600px]">
        <div
          className="fb-page"
          data-href="https://www.facebook.com/profile.php?id=61555717811786"
          data-tabs="timeline"
          data-width="500"
          data-height="600"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        />
      </div>
    </div>
  );
}
