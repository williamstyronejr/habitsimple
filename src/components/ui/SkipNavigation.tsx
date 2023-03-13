const SkipNavigation = () => (
  <div className="absolute w-full left-[-9999px] focus-within:left-0 px-2 py-1 z-50">
    <a
      className="inline-block py-2 px-2 bg-white hover:bg-slate-100"
      href="#content"
    >
      Skip Navigation
    </a>
  </div>
);

export default SkipNavigation;
