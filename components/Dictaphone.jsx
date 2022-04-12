import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useState, useEffect } from 'react';

const Dictaphone = () => {
  const [clipsMade, setClipsMade] = useState([]);
  const [channelName, setChannelName] = useState('');

  // fetch later /api/clip
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript.includes('clip that')) {
      fetch('/api/clip?channelName=' + channelName).then(res => res.json()).then(res => {
        console.log(res.url);
        setClipsMade(clipsMade.concat(res.url));
      });
      resetTranscript();
    }
  }, [transcript])

  if (!browserSupportsSpeechRecognition) {
    return <span>{"Browser doesn't support speech recognition."}</span>;
  }

  return (
    <>
      <div className='flex-col'>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <div className=" pt-0 flex-row">
          <label htmlFor="channelName" className='mr-2'>Channel Name:</label>
          <input onChange={e => setChannelName(e.target.value)} value={channelName} type="text" placeholder="pokimane" className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-gray-300 rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-30 h-5" />
        </div>
        <p>Clips made: {clipsMade.map((url, index) => <a href={url} target='_blank' className='text-blue-700 mr-2' rel='noreferrer noopener'>Clip{index}</a>,)}</p>
        <button className="mr-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => SpeechRecognition.startListening({ continuous: true })}>Start</button>
        <button className="mr-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={SpeechRecognition.stopListening}>Stop</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={resetTranscript}>Reset</button>
      </div>
      <p>{transcript}</p>
    </>
  );
};
export default Dictaphone;