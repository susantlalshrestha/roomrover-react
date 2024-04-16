"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalErrorPage: React.FC<GlobalErrorProps> = (error, reset) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center z-50">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
};

export default GlobalErrorPage;
