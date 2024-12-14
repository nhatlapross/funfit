
import cbor from "cbor";
import {
    resolvePaymentKeyHash, 
    resolvePlutusScriptAddress, 
    BlockfrostProvider, 
    MeshWallet, 
    Transaction,
} from '@meshsdk/core';

import fs from 'node:fs';
import { version } from "node:os";

const blockchainProvider = new BlockfrostProvider(process.env.BLOCKFROST_PROJECT_ID);
const wallet = new MeshWallet({
    networkId: 0,
    fetcher: blockchainProvider,
    key: {
        type: 'root',
        bech32: fs.readFileSync('me.sk').toString(),
    },
});

const blueprint = JSON.parse(fs.readFileSync('./plutus.json'))

const script = {
    code: cbor
        .encode(Buffer.from(blueprint.validators[0].compiledCode, "hex"))
        .toString("hex"),
    version: "V3",
};

const assetMetadata =  {
    "name": "Mesh Token",
    "image": "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
    "mediatype": "image/jpg",
    "desciption": "This NFT was minted by Mesh (https://meshjs.dev/)."
};

const address = (await wallet.getUsedAddresses())[0];

const redeemer = {
    data: {
        alternative: 0,
        field: ['mint-funfit']
    }
}

const unsignedTx = await new Transaction({
    initiator: wallet,
    fetcher: blockchainProvider,
}).mintAsset(script, assetMetadata, redeemer)
  .build();

const signedTx = await wallet.signTx(unsignedTx);

const txHash = await wallet.submitTx(signedTx);

console.log("hash", txHash);
