const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {/* Animated Logo/Brand */}
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-[hsl(15,100%,70%)]/20"></div>
            {/* Animated inner ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[hsl(15,100%,60%)] animate-spin"></div>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[hsl(15,100%,60%)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Brand text */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">Berman Electric</p>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
