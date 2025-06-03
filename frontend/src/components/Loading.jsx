export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative flex justify-center items-center w-24 h-24">
        <div className="absolute w-full h-full rounded-full border-t-4 border-blue-500 animate-spin"></div>
        <div className="absolute w-16 h-16 bg-blue-100 rounded-full animate-ping"></div>
        <span className="text-blue-500 font-semibold">Loading...</span>
      </div>
    </div>
  );
};

export const LoadingAnimation = ({ value }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
      <span className="text-white text-sm">{value}</span>
    </div>
  );
};
