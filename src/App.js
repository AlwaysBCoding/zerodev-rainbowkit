import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets, ConnectButton, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { usePrepareContractWrite, useContractWrite, useAccount, configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { googleWallet, discordWallet, twitterWallet, githubWallet, twitchWallet } from "@zerodevapp/wagmi/rainbowkit";

const ZERODEV_PROJECT_ID = `${process.env.REACT_APP_ZERODEV_TUTORIAL_PROJECT_ID}`;
const SAMPLE_NFT_MUMBAI_CONTRACT_ADDRESS = `0x34bE7f35132E97915633BC1fc020364EA5134863`;
const SAMPLE_NFT_MUMBAI_CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export const NFTMintButton = () => {
  const { address, isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    address: SAMPLE_NFT_MUMBAI_CONTRACT_ADDRESS,
    abi: SAMPLE_NFT_MUMBAI_CONTRACT_ABI,
    functionName: 'mint',
    args: [address],
    enabled: Boolean(address)
  });
  const { data, write } = useContractWrite(config);

  const mintNFT = () => {
    write?.();
  }

  if(isConnected) {
    return (
      <button onClick={mintNFT}>
        Gas-Free Mint
      </button>
    )  
  } else {
    return (<></>)
  }
}

export const App = () => {
  const { chains, provider } = configureChains(
    [mainnet, polygon, polygonMumbai],
    [publicProvider()]
  );
  
  const connectors = connectorsForWallets([
    {
      groupName: 'ZeroDev (AA)',
      wallets: [
        googleWallet({ options: { projectId: ZERODEV_PROJECT_ID }}),
        discordWallet({ options: { projectId: ZERODEV_PROJECT_ID }}),
        twitterWallet({ options: { projectId: ZERODEV_PROJECT_ID }}),
				githubWallet({ options: { projectId: ZERODEV_PROJECT_ID }}),
        twitchWallet({ options: { projectId: ZERODEV_PROJECT_ID }})
      ]
    }
  ])

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="App">
          <ConnectButton />
          <NFTMintButton />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
