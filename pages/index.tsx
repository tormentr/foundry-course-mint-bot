import { useEffect, useState } from 'react';
import { createPublicClient, webSocket, http } from 'viem';
import { arbitrum } from 'viem/chains';
import { FOUNDRY_COURSE_CONTRACT_ADDRESS, FOUNDRY_COURSE_CONTRACT_ABI } from '../constants';
import Confetti from 'react-dom-confetti';
import { createHmac } from 'crypto';

const confettiConfig = {
  spread: 360,
  startVelocity: 40,
  elementCount: 600,
  decay: 0.91,
};

const RPC_PROVIDER_API_KEY = process.env.NEXT_PUBLIC_RPC_PROVIDER_API_KEY || '';
const BIG_FAT_SECRET = process.env.NEXT_PUBLIC_BIG_FAT_SECRET || '';

export default function Home() {
  const [events, setEvents] = useState([] as any);
  const [confetti, setConfetti] = useState(false);

  const sendTweet = async (twitterHandle: string) => {
    if (!twitterHandle) {
      console.log('Twitter handle is undefined or empty');
      return;
    }
    if (!twitterHandle.startsWith('@')) {
      twitterHandle = '@' + twitterHandle;
    }
    const token = createHmac('sha256', BIG_FAT_SECRET).update(twitterHandle).digest('hex');
    const response = await fetch('/api/sendTweet', {
      method: 'POST',
      body: JSON.stringify({ twitterHandle }),
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log("Tweet Submitted", data);
  };


  useEffect(() => {
    const webSocketClient = createPublicClient({
      chain: arbitrum,
      transport: webSocket(`wss://arb-mainnet.g.alchemy.com/v2/${RPC_PROVIDER_API_KEY}`)
    });

    const httpClient = createPublicClient({
      chain: arbitrum,
      transport: http(`https://arb-mainnet.g.alchemy.com/v2/${RPC_PROVIDER_API_KEY}`)
    })

    async function listenToEvents() {
      const unwatch = webSocketClient.watchContractEvent({
        address: FOUNDRY_COURSE_CONTRACT_ADDRESS,
        abi: FOUNDRY_COURSE_CONTRACT_ABI,
        eventName: 'ChallengeSolved',
        onLogs: (logs: any) => {
          console.log("New Challenge Solved Event!", logs);
          const { args: { solver, challenge, twitterHandle }, eventName } = logs[0];
          setConfetti(true);
          setTimeout(() => setConfetti(false), 5000);
          setEvents((prevEvents: any) => [...prevEvents, logs[0]]);
          sendTweet(twitterHandle);
        },
      });

      return () => {
        unwatch();
      };
    }

    async function getPreviousEvents() {
      const filter = await httpClient.createContractEventFilter({
        abi: FOUNDRY_COURSE_CONTRACT_ABI,
        address: FOUNDRY_COURSE_CONTRACT_ADDRESS,
        eventName: 'ChallengeSolved',
        fromBlock: 97795932n,
      })

      const fetchedEvents = await httpClient.getFilterLogs({ filter });
      setEvents(fetchedEvents);
    }

    getPreviousEvents();
    listenToEvents();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-12">
      <Confetti active={confetti} config={confettiConfig} />
      <div className="w-full md:max-w-2xl mx-4">
        <div className="flex justify-around mb-4">
          <a href="https://twitter.com/PatrickAlphaC" target="_blank" rel="noreferrer" className="flex flex-col items-center">
            <img src="/patrick.png" alt="PatrickAlphaC" className="w-20 h-20 rounded-full" />
            <span>PatrickAlphaC</span>
          </a>
          <a href="https://twitter.com/foundrymintbot" target="_blank" rel="noreferrer" className="flex flex-col items-center">
            <img src="/mintfrog.png" alt="Minting Bot" className="w-20 h-20 rounded-full" />
            <span>NFT Mint Tracker</span>
          </a>
          <a href="https://twitter.com/0xMarkeljan" target="_blank" rel="noreferrer" className="flex flex-col items-center">
            <img src="/markeljan.png" alt="0xMarkeljan" className="w-20 h-20 rounded-full" />
            <span>0xMarkeljan</span>
          </a>
        </div>
        <div className="text-4xl text-start px-8 py-4 bg-blue-800">
          Listening for contract events<span className="ellipsis"></span>
        </div>
        <div className="overflow-y-auto h-[600px] px-4 py-6">
          {[...events].reverse().map((event: any, index: any) => {
            const { args: { solver, challenge, twitterHandle }, transactionHash } = event;
            return (
              <a
                key={index}
                href={`https://arbiscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noreferrer"
                className="block mb-4 p-4 bg-teal-500 rounded-md overflow-hidden"
              >
                <div className="scrollable-card-content">
                  <div className="font-semibold">Solver: <span className="font-normal">{solver}</span></div>
                  <div className="font-semibold">Challenge: <span className="font-normal">{challenge}</span></div>
                  <div className="font-semibold">Twitter Handle: <span className="font-normal">{twitterHandle}</span></div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <footer className="w-full mt-auto py-8 bg-gray-800">
        <div className="flex items-center justify-center">
          <a href="https://github.com/markeljan/foundry-course-mint-bot" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-white text-lg">
            <img src="/github.png" alt="GitHub" className="w-8 h-8" />
            <span>Check out the source code on GitHub!</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
