import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const createNft = async (
    minterContract,
    performActions,
    { name, description, ipfsImage, ownerAddress, attributes }
) => {
    await performActions(async (kit) => {
        if (!name || !description || !ipfsImage) return;
        const { defaultAccount } = kit;

        const data = JSON.stringify({
            name,
            description,
            image: ipfsImage,
            owner: defaultAccount,
            attributes,
        });

        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            return await minterContract.methods.safeMint(ownerAddress, url).send({ from: defaultAccount });


        } catch (error) {
            console.log("Error uploading file: ", error)
        }
    });
};

export const uploadToIpfs = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const added = await client.add(file, {
            progress: (prog) => console.log(`received: ${prog}`)
        });
        return `https://ipfs.infura.io/ipfs/${added.path}`;
    } catch (error) {
        console.log("Error uploading file: ", error)
    }
}

export const getNfts = async (minterContract) => {
    try {
        const nfts = [];
        const nftsLength = await minterContract.methods.totalSupply().call();
        for (let i = 0; i < Number(nftsLength); i++) {
            const nft = new Promise(async (resolve) => {
                const res = await minterContract.methods.tokenURI(i).call();
                const meta = await fetchNftMeta(res);
                const owner = await fetchNftOwner(minterContract, i);

                resolve({
                    index: i,
                    owner,
                    name: meta.data.name,
                    image: meta.data.image,
                    description: meta.data.description,
                    attributes: meta.data.attributes,
                });
            });
            nfts.push(nft)
        }
        return Promise.all(nfts);
    } catch (error) {
        console.log("Error getting nfts: ", error);
    }
};

export const fetchNftMeta = async (ipfsUrl) => {
    try {
        if (!ipfsUrl) return null;
        return await axios.get(ipfsUrl);

    } catch (error) {
        console.log("Error fetching nft meta: ", error)
    }
};

export const fetchNftOwner = async (minterContract, index) => {
    try {
        return await minterContract.methods.ownerOf(index).call();
    } catch (error) {
        console.log("Error fetching nft owner: ", error)
    }
};

export const fetchNftContractOwner = async (minterContract) => {
    try {
        return await minterContract.methods.owner().call();
    } catch (error) {
        console.log("Error fetching owner of nft contract: ", error)
    }
}
