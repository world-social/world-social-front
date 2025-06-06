// Make sure this is only the function you're calling
// Otherwise you will get an error
import { WST } from '../abi/WST'
import {
  MiniAppSendTransactionPayload,
  MiniKit,
  ResponseEvent,
  SendTransactionErrorCodes,
  Tokens,
  tokenToDecimals,
  VerificationLevel,
} from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react'
import { useState } from 'react'
import {
  createPublicClient,
  decodeAbiParameters,
  http,
  parseAbiParameters,
} from 'viem'
import { worldchain } from 'viem/chains';
import * as yup from 'yup';

// Using any type for simplicity since the exact structure is complex
// and we don't have access to the actual type definitions
type SendTransactionResult = any;

const sendTransactionSuccessPayloadSchema = yup.object({
  status: yup.string<'success'>().oneOf(['success']),
  transaction_status: yup.string<'submitted'>().oneOf(['submitted']),
  transaction_id: yup.string().required(),
  from: yup.string().optional(),
  chain: yup.string().required(),
  timestamp: yup.string().required(),
});

const sendTransactionErrorPayloadSchema = yup.object({
  error_code: yup
    .string<SendTransactionErrorCodes>()
    .oneOf(Object.values(SendTransactionErrorCodes))
    .required(),
  status: yup.string<'error'>().equals(['error']).required(),
});

const testTokens = {
  optimism: {
    USDC: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    USDCE: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
  },
  worldchain: {
    USDCE: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1',
  },
};

export function useWST() {
  const [transactionId, setTransactionId] = useState<string>('')
  const [transactionError, setTransactionError] = useState<string>('')

  const client = createPublicClient({
    chain: worldchain,
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  })
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    client,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID as string,
    },
    transactionId: transactionId,
  })

  const sendTransaction = async () => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString()

    // Transfers can also be at most 1 hour in the future.
    const permitTransfer = {
      permitted: {
        token: testTokens.worldchain.USDCE,
        amount: '10000',
      },
      nonce: Date.now().toString(),
      deadline,
    }

    const permitTransferArgsForm = [
      [permitTransfer.permitted.token, permitTransfer.permitted.amount],
      permitTransfer.nonce,
      permitTransfer.deadline,
    ]

    const transferDetails = {
      to: '0xbCE15f3E8110b45342d470eB633a8908DE03684D',
      requestedAmount: '10000',
    }

    const transferDetailsArgsForm = [transferDetails.to, transferDetails.requestedAmount]

    try {
      // Cast to unknown first to avoid type checking issues
      const result = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: '0xF552c9d5Cb9F6Df6590479d43c4929b69458e4e1' as `0x${string}`,
            abi: WST,
            functionName: 'mint',
            args: [
              permitTransferArgsForm, 
              transferDetailsArgsForm, 
              'PERMIT2_SIGNATURE_PLACEHOLDER_0'
            ],
          },
        ],
        permit2: [
          {
            ...permitTransfer,
            spender: '0xbCE15f3E8110b45342d470eB633a8908DE03684D',
          },
        ],
      }) as unknown as SendTransactionResult;
      
      // Safely access the property
      if (result && result.commandPayload && typeof result.commandPayload === 'object' && 'id' in result.commandPayload) {
        setTransactionId(result.commandPayload.id);
      }
    } catch (error: any) {
      setTransactionError(error);
      console.error("Error sending transaction:", error);
    }
  }

  return {
    sendTransaction,
    transactionError,
    isConfirming,
    isConfirmed
  }
}
