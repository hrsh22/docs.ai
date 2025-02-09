
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { encodeFunctionData, namehash } from "viem";
import { normalize } from "viem/ens";
import { ethers } from "ethers";
import { BaseNamesRegistrarControllerAddress, L2ResolverAddress, l2ResolverABI, registrarABI, baseNameRegex } from "./constants";

function createRegisterContractMethodArgs(baseName: string, addressId: string) {
    const addressData = encodeFunctionData({
        abi: l2ResolverABI,
        functionName: "setAddr",
        args: [namehash(normalize(baseName)), addressId],
    });
    const nameData = encodeFunctionData({
        abi: l2ResolverABI,
        functionName: "setName",
        args: [namehash(normalize(baseName)), baseName],
    });

    const registerArgs = {
        request: [
            baseName.replace(baseNameRegex, ""),
            addressId,
            "31557600",
            L2ResolverAddress,
            [addressData, nameData],
            true,
        ],
    };
    console.log(`Register contract method arguments constructed: `, registerArgs);

    return registerArgs;
}

async function registerBaseName(wallet: any, registerArgs: any) {
    try {

        console.log('BEFORE CONTRACT INVOCATION')
        const contractInvocation = await wallet.invokeContract({
            contractAddress: BaseNamesRegistrarControllerAddress,
            method: "register",
            abi: registrarABI,
            args: registerArgs,
            amount: 0.002,
            assetId: Coinbase.assets.Eth,
        });

        console.log("CONTRACT INVOCATION: ", contractInvocation);

        await contractInvocation.wait();

        console.log(`Successfully registered Basename ${registerArgs[0]} for wallet: `, wallet);
    } catch (error) {
        console.error(`Error registering Basename for ${wallet}: `, error);
        throw error;
    }
}

async function createWalletAndAssignBasename(baseName: string) {
    try {
        // Manage CDP Secret API Key for Coinbase SDK.
        // Configure location to CDP Secret API Key.
        Coinbase.configureFromJson({
            filePath: `${__dirname}/cdp_api_key.json`,
        });

        const wallet = await Wallet.create();
        const defaultAddress = await wallet.getDefaultAddress();

        console.log("DEFAULT ADDRESS: ", defaultAddress);

        const addressId = defaultAddress.getId();

        console.log("ADDRESS ID: ", addressId);

        //transfering funds to the wallet
        const provider = new ethers.providers.JsonRpcProvider('https://sepolia.base.org');
        const fundingWallet = process.env.BASE_WALLET_PRIVATE_KEY!;

        console.log("FUNDING WALLET: ", fundingWallet);

        const senderWallet = new ethers.Wallet(fundingWallet, provider);

        const tx = await senderWallet.sendTransaction({
            to: addressId,
            value: ethers.utils.parseEther("0.003")
        });

        await tx.wait();

        console.log("Successfully transferred funds to the wallet: ", tx);
        console.log("BASENAME: ", baseName.replace(baseNameRegex, ""))



        // Register Basename.
        const registerArgs = createRegisterContractMethodArgs(baseName, defaultAddress.getId());
        await registerBaseName(wallet, registerArgs);

        return { wallet, baseName };
    } catch (error) {
        console.error(`Error in registering Basename: `, error);
    }
};

export default createWalletAndAssignBasename;
