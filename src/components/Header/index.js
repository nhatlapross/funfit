'use client';
import React, { useEffect, useState } from 'react';
import { Wallet, Menu, X } from 'lucide-react';
import { Dumbbell } from 'lucide-react';
import { BrowserWallet, Transaction } from '@martifylabs/mesh';
import { useWallet, useAddress } from '@martifylabs/mesh-react';
import CardanoWalletList from '@/components/WalletModal/CardanoWalletList';
import { useRouter } from 'next/navigation'

const CardanoNavbar = () => {
  //const [isWalletConnected, setIsWalletConnected] = useState(false);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { connected, disconnect } = useWallet();
  const address = useAddress();

  const disconnectWallet = () => {
    // setIsWalletConnected(false);
    // setWalletAddress('');
    localStorage.removeItem('walletConnected');
    disconnect();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sendLace = async () => {
    const wallet = await BrowserWallet.enable('Nami');
    const tx = new Transaction({ initiator: wallet })
      .sendLovelace(
        "addr_test1qpkaf3r2xt85j7h3hvx4xtmltcuaegzjyz05ve3czyrtr9g0xlr37m45stpvqn03yfezxfgzrezntprt4u8t2jld4t7shz7cpa",
        "10000000"
      )

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
  }

  return (
    <nav className="relative flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2" onClick={() => router.push('/')}>
          <Dumbbell className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold">Funfit</h2>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <a className="hover:text-gray-300" onClick={() => router.push('/')}>Home</a>
          <a className="hover:text-gray-300" onClick={() => router.push('/profile')}>Profile</a>
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
        {connected ? (
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <CardanoWalletList />
          // <button
          //   onClick={connectWallet}
          //   className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded flex items-center space-x-2 text-sm"
          // >
          //   <Wallet className="w-4 h-4" />
          //   <span>Connect Wallet</span>
          // </button>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 z-50">
          <div className="flex flex-col items-center py-4 space-y-4">
            <a className="hover:text-gray-300" onClick={() => router.push('/')}>Home</a>
            <a className="hover:text-gray-300" onClick={() => router.push('/profile')}>Profile</a>
            {connected ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <CardanoWalletList />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default CardanoNavbar;