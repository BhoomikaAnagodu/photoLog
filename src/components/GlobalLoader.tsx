const GlobalLoader = () => {
  return (
    <div className="fixed w-screen h-screen inset-0 bg-white/70 z-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-theme-lilac border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default GlobalLoader;
