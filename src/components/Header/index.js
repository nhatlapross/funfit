'use client';
import React, { useState } from 'react';
import { Wallet, Menu, X } from 'lucide-react';
import { Dumbbell } from 'lucide-react';
const CardanoNavbar = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const connectWallet = async () => {
    try {
      const address = 'addr1qx...'; // Example Cardano address
      setWalletAddress(address);
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Wallet connection failed', error);
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="relative flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold">Funfit</h2>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <a href="#" className="hover:text-gray-300">Home</a>
          <a href="#" className="hover:text-gray-300">Explore</a>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button 
          onClick={toggleMobileMenu} 
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {isWalletConnected ? (
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm">{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded flex items-center space-x-2 text-sm"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 md:hidden">
          <div className="flex flex-col items-center py-4 space-y-4">
            <a href="#" className="hover:text-gray-300">Home</a>
            <a href="#" className="hover:text-gray-300">Explore</a>
            
            {isWalletConnected ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded flex items-center space-x-2"
              >
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default CardanoNavbar;