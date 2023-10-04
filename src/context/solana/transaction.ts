import { web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import axios from "axios";
import { IDL } from "./jackpot";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import {
  BET3_WALLET,
  CODY_WALLET,
  EXPER_WALLET,
  GamePool,
  GAME_SEED,
  JACKPOT_PROGRAM_ID,
  JERZY_WALLET,
  TEAM_WALLET,
  VAULT_SEED,
  GRAVE_PROGRAM_ID,
  INFINITE_PROGRAM_ID,
} from "./types";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { API_URL, GRAVE_API_URL, INFINITE_API_URL, RPC_URL } from "../../config";
import { errorAlert } from "../../components/ToastGroup";
import { useSocket } from "../SocketContext";

export const solConnection = new web3.Connection(RPC_URL);

export const playGame = async (
  wallet: WalletContextState,
  amount: number,
  setLoading: Function,
  type: string
) => {
  if (wallet.publicKey === null) return;

  let programId;
  let api;
  if (type === "tower") {
    programId = new anchor.web3.PublicKey(JACKPOT_PROGRAM_ID);
    api = API_URL;
  }
  else if (type === "grave") {
    programId = new anchor.web3.PublicKey(GRAVE_PROGRAM_ID);
    api = GRAVE_API_URL;
  } else if (type === "infinite") {
    programId = new anchor.web3.PublicKey(INFINITE_PROGRAM_ID);
    api = INFINITE_API_URL
  }
  else return;

  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    programId,
    provider
  );
  try {
    setLoading(true);
    const tx = await createPlayGameTx(userAddress, amount, program);
    const { blockhash } = await solConnection.getLatestBlockhash();
    tx.feePayer = userAddress;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction) {
      // check if creating room conflicts
      try {
        await axios.post(`${api}requestCreate/`);
      } catch (e) {
        console.error(" --> playGame: Failed due to creating conflict");
        errorAlert("Something went wrong. Please try again!");
        setLoading(false);
        return;
      }
      const signedTx = await wallet.signTransaction(tx);
      console.log("signedTx.serialize() play game =>", Buffer.from(signedTx.serialize()).toString("base64"));
      const encodedTx = Buffer.from(signedTx.serialize()).toString("base64");
      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        {
          skipPreflight: true,
          maxRetries: 3,
          preflightCommitment: "confirmed",
        }
      );
      await axios.post(`${api}createGame/`, {
        txId: txId,
        encodedTx: encodedTx
      });

      console.log("Signature:", encodedTx);
      // release mutex for processing request if success
      await axios.post(`${api}endRequest/`);
      setLoading(false);
    }
  } catch (error) {
    console.log(" --> playGame:", error);
    errorAlert("Something went wrong. Please try again!");
    // release mutex for processing request if failed
    await axios.post(`${api}endRequest/`);
    setLoading(false);
  }
};
export const enterGame = async (
  wallet: WalletContextState,
  pda: PublicKey,
  amount: number,
  setLoading: Function,
  endTimestamp: number,
  type: string
) => {
  if (wallet.publicKey === null) return;

  /// Comment this because backend is processed such conflict
  // console.log(endTimestamp - now, "(endTimestamp - now)", endTimestamp);
  let programId;
  let api;
  if (type === "tower") {
    programId = new anchor.web3.PublicKey(JACKPOT_PROGRAM_ID);
    api = API_URL;
  }
  else if (type === "grave") {
    programId = new anchor.web3.PublicKey(GRAVE_PROGRAM_ID);
    api = GRAVE_API_URL;
  }
  else if (type === "infinite") {
    programId = new anchor.web3.PublicKey(INFINITE_PROGRAM_ID);
    api = INFINITE_API_URL;
  }
  else return;

  const cloneWindow: any = window;
  const userAddress = wallet.publicKey;
  const provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    programId,
    provider
  );
  try {
    setLoading(true);
    const tx = await createEnterGameTx(userAddress, pda, amount, program);
    const { blockhash } = await solConnection.getLatestBlockhash();
    tx.feePayer = userAddress;
    tx.recentBlockhash = blockhash;
    if (wallet.signTransaction) {
      // check if creating room conflicts
      try {
        await axios.post(`${api}requestEnter/`);
      } catch (e) {
        console.error(
          " --> enterGame: Failed due to entering and setting winner conflict"
        );
        errorAlert("Something went wrong. Please try again!");
        setLoading(false);
        return;
      }
      const signedTx = await wallet.signTransaction(tx);
      const encodedTx = Buffer.from(signedTx.serialize()).toString("base64");
      const txId = await provider.connection.sendRawTransaction(
        signedTx.serialize(),
        {
          skipPreflight: true,
          maxRetries: 3,
          preflightCommitment: "confirmed",
        }
      );
      await axios.post(`${api}enterGame/`, {
        txId: txId,
        encodedTx: encodedTx
      });
      console.log("Signature:", txId);
      // release mutex for processing request if success
      await axios.post(`${api}endEnterRequest/`);
      setLoading(false);
    }
    setLoading(false);
  } catch (error) {
    console.error(" --> enterGame:", error);
    errorAlert("Something went wrong. Please try again!");
    // release mutex for processing request if failed
    await axios.post(`${api}endEnterRequest/`);
    setLoading(false);
  }
};

export const createPlayGameTx = async (
  userAddress: PublicKey,
  amount: number,
  program: anchor.Program,
) => {
  let now = new Date();
  let ts = Math.floor(now.getTime() / 1000);

  const [solVault, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED)],
    program.programId
  );

  const [gamePool, gameBump] = await PublicKey.findProgramAddress(
    [
      Buffer.from(GAME_SEED),
      userAddress.toBuffer(),
      new anchor.BN(ts).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  console.log("Game PDA: ", gamePool.toBase58());
  const tx = new Transaction();

  tx.add(
    program.instruction.playGame(
      new anchor.BN(ts),
      new anchor.BN(amount * LAMPORTS_PER_SOL),
      {
        accounts: {
          admin: userAddress,
          gamePool,
          solVault,
          codyWallet: CODY_WALLET,
          bet3Wallet: BET3_WALLET,
          jerzyWallet: JERZY_WALLET,
          experWallet: EXPER_WALLET,
          teamWallet: TEAM_WALLET,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [],
        signers: [],
      }
    )
  );

  return tx;
};

export const createEnterGameTx = async (
  userAddress: PublicKey,
  gamePool: PublicKey,
  amount: number,
  program: anchor.Program,
) => {
  const [solVault, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_SEED)],
    program.programId
  );
  console.log(solVault.toBase58());

  const tx = new Transaction();

  tx.add(
    program.instruction.enterGame(new anchor.BN(amount * LAMPORTS_PER_SOL), {
      accounts: {
        admin: userAddress,
        gamePool,
        solVault,
        codyWallet: CODY_WALLET,
        bet3Wallet: BET3_WALLET,
        jerzyWallet: JERZY_WALLET,
        experWallet: EXPER_WALLET,
        teamWallet: TEAM_WALLET,
        systemProgram: SystemProgram.programId,
      },
      instructions: [],
      signers: [],
    })
  );

  return tx;
};

/// Comment this because no need to read PDA data from FE side directly
// export const getStateByKey = async (
//   wallet: WalletContextState,
//   gameKey: PublicKey
// ): Promise<GamePool | null> => {
//   if (wallet.publicKey === null) return null;
//   const cloneWindow: any = window;
//   const userAddress = wallet.publicKey;
//   const provider = new anchor.AnchorProvider(
//     solConnection,
//     cloneWindow["solana"],
//     anchor.AnchorProvider.defaultOptions()
//   );
//   const program = new anchor.Program(
//     IDL as anchor.Idl,
//     JACKPOT_PROGRAM_ID,
//     provider
//   );
//   try {
//     const gameState = await program.account.gamePool.fetch(gameKey);
//     return gameState as unknown as GamePool;
//   } catch {
//     return null;
//   }
// };
