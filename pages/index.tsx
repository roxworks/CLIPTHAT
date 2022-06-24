import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { FaYoutube, FaTiktok } from 'react-icons/fa';

//dynamic import Dictaphone
const Dictaphone = dynamic(() => import('../components/Dictaphone'), { ssr: false });
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';
import { EyeIcon } from '@heroicons/react/solid';
import { DownloadIcon } from '@heroicons/react/solid';

type TClipsMade = {
  url: string;
  name: string;
  src: string;
};

const Home: NextPage = () => {
  const [clipsMade, setClipsMade] = useState<TClipsMade[]>([]);
  const [activationPhrase, setActivationPhrase] = useState('Clip that');

  const { data: session } = useSession();

  const getClipbotUrl = (url: string) => {
    let id = url.replace('https://clips.twitch.tv/', '');
    id = id.replace('/edit', '');
    const clipbotUrl = `https://app.clipbot.tv/clips/${id}?src=CLIPTHAT`;

    return clipbotUrl;
  };

  const handleRemoveClips = () => {
    setClipsMade([]);
    localStorage.setItem('clipsMade', JSON.stringify([]));
  };

  const handleDeleteClip = (url: string) => {
    const updateClips = clipsMade.filter((clip: TClipsMade) => clip.url !== url);
    setClipsMade(updateClips);
    localStorage.setItem('clipsMade', JSON.stringify(updateClips));
  };

  return (
    <div className={'bg-gray-800 text-white min-h-screen md:block flex flex-col-reverse'}>
      <Head>
        <title>Make Twitch clips with your voice!</title>
        <meta
          name="description"
          content='Just say "Clip That!" to make a clip during your stream. Powered by Clipbot.tv.'
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full md:w-96 min-h-screen max-h-screen shadow-md bg-gray-600 px-1 float-left overflow-y-auto ">
        <ul className="relative">
          <li key={'clipbot.tv'} className="relative">
            <a
              href="https://clipbot.tv?utm_source=clipthat"
              target="_blank"
              rel="noreferrer noopener"
            >
              <div className="text-lg flex-col text-center py-4 px-6 w-full text-blue-300 text-ellipsis rounded bg-gray-800 hover:text-gray-900 hover:bg-gray-400 mt-2 p-2 transition duration-300 ease-in-out">
                <Image
                  alt="Clipbot.tv logo"
                  className="m-auto mb-1"
                  height="45px"
                  width="128px"
                  src="/clipbot-logo.png"
                />
                <p className="w-full">
                  Want to automatically post your clips to Tiktok and Youtube?{' '}
                </p>
              </div>
            </a>
          </li>
          {clipsMade.length > 1 && (
            <li className="relative">
              <button
                onClick={handleRemoveClips}
                className="flex w-full justify-center gap-4 items-center text-lg  overflow-hidden text-blue-300 text-ellipsis whitespace-nowrap bg-gray-800 hover:text-gray-900 hover:bg-gray-400 mt-2 p-2 transition duration-300 ease-in-out"
              >
                <TrashIcon className="ml-2 w-8 h-8 p-1 " />
                <span>Clear Clips</span>
              </button>
            </li>
          )}
          {clipsMade
            .slice()
            .reverse()
            .map(({ url, name, src }, index) => (
              <li key={url} className="relative h-42">
                <div className="flex justify-around items-center text-lg py-4 px-6 h-12 overflow-hidden text-blue-300 text-ellipsis whitespace-nowrap bg-gray-800 hover:text-gray-900 hover:bg-gray-400 mt-2 p-2 transition duration-300 ease-in-out">
                  {name}
                  <a target="_blank" href={url} rel="noreferrer noopener" className="">
                    <PencilIcon className="ml-2 w-8 h-8 p-1 border-gray-300 border-2 rounded-md hover:bg-slate-50" />
                  </a>
                  <a
                    target="_blank"
                    href={(url as string).replace('/edit', '')}
                    rel="noreferrer noopener"
                    className=""
                  >
                    <EyeIcon className="ml-2 w-8 h-8 p-1 border-gray-300 border-2 rounded-md hover:bg-slate-50" />
                  </a>
                  <a target="_blank" href={src} rel="noreferrer noopener" className="">
                    <DownloadIcon className="ml-2 w-8 h-8 p-1 border-gray-300 border-2 rounded-md hover:bg-slate-50" />
                  </a>
                  <a
                    target="_blank"
                    href={getClipbotUrl(url)}
                    rel="noreferrer noopener"
                    className=""
                  >
                    <FaYoutube className="ml-2 w-8 h-8 p-1 border-gray-300 border-2 rounded-md hover:bg-slate-50" />
                  </a>
                  <a
                    target="_blank"
                    href={getClipbotUrl(url)}
                    rel="noreferrer noopener"
                    className=""
                  >
                    <FaTiktok className="ml-2 w-8 h-8 p-1 border-gray-300 border-2 rounded-md hover:bg-slate-50" />
                  </a>
                  <button onClick={() => handleDeleteClip(url)}>
                    <TrashIcon className="ml-2 w-8 h-8 p-1 border-red-500 border-2 rounded-md hover:bg-slate-50" />
                  </button>
                </div>
                <video className="w-full h-full" src={src} controls />
              </li>
            ))}
        </ul>
      </div>

      <div className="p-12 text-center relative overflow-hidden h-screen bg-no-repeat bg-cover rounded-lg">
        <div
          className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <div className="flex justify-center items-center h-full">
            <div className="text-white">
              <h2 className="font-semibold text-4xl mb-4 uppercase">{activationPhrase}!</h2>
              <h4 className="font-semibold text-xl mb-1 hidden md:block">
                Just say &ldquo;{activationPhrase}&rdquo; to make a live clip on Twitch.
                <br /> Clips will show up on the bar on the left.
              </h4>
              <h4 className="font-semibold text-xl mb-1 md:hidden">
                Just say &ldquo;{activationPhrase}&rdquo; to make a live clip on Twitch.
                <br /> Clips will show up in the section below.
              </h4>
              <h6 className="font-semibold text-sm mb-6 italic">(Supported only on Chrome)</h6>
              <div
                className={
                  'inline-block px-7 py-3 mb-1 border-2 border-gray-200 text-gray-200 font-medium text-sm leading-snug uppercase rounded focus:outline-none focus:ring-0 transition duration-150 ease-in-out' +
                  (session ? '' : ' hover:bg-gray-800 cursor-pointer')
                }
                onClick={() => {
                  session ? null : signIn('twitch');
                }}
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
              >
                {session ? (
                  <>
                    Your Channel: <span className="text-blue-200">{session?.user?.name}</span>{' '}
                    <br />
                    <Dictaphone
                      setClipsMade={setClipsMade}
                      clipsMade={clipsMade}
                      activationPhrase={activationPhrase}
                      setActivationPhrase={setActivationPhrase}
                    />
                    <button onClick={() => signOut()}>Sign out</button>
                  </>
                ) : (
                  <>
                    <div className="flex text-xl">
                      <Image src="/twitch-logo.png" width="28px" height="24px" />
                      <p className={'ml-2'}>Sign in to Twitch</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
