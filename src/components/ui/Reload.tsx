const Reload = ({ retry }: { retry: Function }) => {
  return (
    <div>
      <button
        onClick={() => {
          retry();
        }}
        type="button"
        className="block px-5 py-2 text-xl mx-auto rounded-lg bg-black shadow-md hover:shadow-lg text-white"
      >
        Reload
      </button>
    </div>
  );
};

export default Reload;
