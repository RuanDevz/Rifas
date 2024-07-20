'use client'
import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the context state
interface RifasContextType {
    rifasAvailable: number;
    setRifasAvailable: React.Dispatch<React.SetStateAction<number>>;
}

const defaultValue: RifasContextType = {
    rifasAvailable: 0,
    setRifasAvailable: () => {},
};

const RifasContext = createContext<RifasContextType>(defaultValue);

const RifasProvider = ({ children }: { children: ReactNode }) => {
    const [rifasAvailable, setRifasAvailable] = useState(defaultValue.rifasAvailable);

    return (
        <RifasContext.Provider value={{ rifasAvailable, setRifasAvailable }}>
            {children}
        </RifasContext.Provider>
    );
};

export { RifasContext, RifasProvider };
