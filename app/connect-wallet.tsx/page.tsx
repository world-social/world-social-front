import { WorldcoinLogo } from "@/components/ui/worldcoin-logo"
import { WalletAuthButton } from "@/components/auth/wallet-auth"

export default function ConnectWallet({connectWalletCallback} : { connectWalletCallback: () => void }) {   
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-900 flex items-center justify-center p-4">
              <div className="max-w-md w-full">
                <div className="text-center mb-8">
                  <h1 className="text-purple-100">Sign in with your Worldcoin wallet</h1>
                </div>
        
                <div className="items-center justify-center bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-6">
                    <WorldcoinLogo size={48} />
                  </div>
                  {/* <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-600"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                      </svg>
                    </div>
                  </div> */}
        
                  <WalletAuthButton onSuccess={ connectWalletCallback }/>
                </div>
              </div>
            </div>
    )
}