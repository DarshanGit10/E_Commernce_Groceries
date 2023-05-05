import { useState, useContext, createContext } from "react";

const SearchContext = createContext();
const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState({
    keyword: "",
    matchingProducts: []
  });

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom Hook
const useSearch = () => useContext(SearchContext);

export { useSearch,SearchProvider };
