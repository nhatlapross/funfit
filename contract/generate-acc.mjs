import { MeshWallet } from "@meshsdk/core";
import fs from 'node:fs';

(async () => {
    // Tạo secret key
    const secret_key = MeshWallet.brew(true);
    if (!secret_key) {
        console.error("Failed to generate secret key.");
        process.exit(1);
    }
    console.log("Secret key:", secret_key);
    fs.writeFileSync('me.sk', secret_key);

    // Khởi tạo ví
    const wallet = new MeshWallet({
        networkId: 0, // Testnet
        key: {
            type: 'root',
            bech32: secret_key,
        },
    });

    try {
        // Gọi hàm bất đồng bộ và chờ kết quả
        const addresses = await wallet.getUnusedAddresses();
        console.log("Addresses array:", addresses);

        if (addresses && addresses.length > 0) {
            const address = addresses[0];
            console.log("First address:", address);

            // Ghi địa chỉ vào file
            fs.writeFileSync('me.addr', address);
        } else {
            console.error("No unused addresses available.");
        }
    } catch (error) {
        console.error("Error fetching addresses:", error);
    }
})();