type Props = {
  containerClass?: string;
};

const SearchBar: React.FC<Props> = ({ containerClass }) => {
  return (
    <div className={containerClass}>
      <form className="w-9/12 h-16 backdrop-blur-xl bg-white/30 shadow-md rounded-full flex divide-x text-sm">
        <input
          type="text"
          id="search"
          name="search"
          className="flex-1 grow text-center form-input rounded-l-full"
          placeholder="Search"
        />
        <input
          type="number"
          id="minPrice"
          name="minPrice"
          className="text-center form-input"
          placeholder="Minmum Price"
        />
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          className="form-input text-center"
          placeholder="Maximum Price"
        />
        <button
          className="flex-1 shrink text-center rounded-r-full"
          type="submit"
        >
          Filter
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
