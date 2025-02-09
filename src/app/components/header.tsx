"use client"
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import Link from 'next/link'

const Header = () => {
  return (
    <nav className="sticky top-0 w-full bg-white border-b border-gray-200 px-6 py-4 z-50 shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          docs.ai
        </Link>
        {/* <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Connect Wallet
        </button> */}
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className={color.foregroundMuted} />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </nav>
  );
};

export default Header;