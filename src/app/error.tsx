"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage: React.FC<ErrorProps> = (error, reset) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center z-50">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
};

export default ErrorPage;
