import { useState } from 'react';
import { SearchContext } from './SearchContext';

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, isSearchVisible, setIsSearchVisible }}>
            {children}
        </SearchContext.Provider>
    );
};
