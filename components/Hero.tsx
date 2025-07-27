import React from 'react';

export default function Hero() {
  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="@container">
          <div className="@[480px]:p-4">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_oUcpAtIbdfSxjOebPXT7aaM9_nqS_tGwDjzWyVT-vVt-XEIPHZ3cW5MQiflqXt15K7DEeEjocUtHHzDgw1UXmNsc9mK9VuqidzcWLX0rpgplzJFLadCK90UkBrHB3bff-cBLaAwBDoURzer96GFm1BwBY3c3CtzVj_bTbpuwM_6OH_bloCXtakF54suEbI0k_KkEKyqGrXeDl9bP5VzlYLLmS4KfUSU0lxm9mmzQ6eCpFflXfAcZoM9TBhC4PELykOqfhVJevig")`
              }}
            >
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  Create with Purpose. Share with Authority. Build What Matters.
                </h1>
                <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                  Empowering digital creators to lead with boldness and build what lasts.
                </h2>
              </div>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-blue text-navy text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-blue/90 transition-all duration-200">
                <span className="truncate">Get Early Access</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 