import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Dictaphone = ({ setClipsMade, clipsMade, activationPhrase, setActivationPhrase }) => {

  // fetch later /api/clip
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript.toLowerCase().includes(activationPhrase.toLowerCase())) {
      resetTranscript();
      fetch('/api/clip?').then(res => res.json()).then(res => {
        console.log(res.url);
        setClipsMade(clipsMade.concat({url: res.url, name: new Date().toLocaleTimeString()}));
        Swal.fire({
          title: 'Clip saved!',
          text: 'You can find it in your clips menu on the left',
          icon: 'success',
          timer: 3000
        });
      });
    }
  }, [transcript])

  if (!browserSupportsSpeechRecognition) {
    return <span>{"Browser doesn't support speech recognition."}</span>;
  }

  

  return (
    <div className='mt-2 max-w-md'>
      <div className='flex-col space-y-2'>
      {!browserSupportsSpeechRecognition 
        ? <span>{"Browser doesn't support speech recognition. Please use chrome."}</span>
        : !isMicrophoneAvailable
          ? <span>{"Microphone is not available. Please enable microphone in the top left."}</span> 
          : (
            <>
        <p className='flex-row'>Microphone: <button className={"mr-3 text-white font-bold py-1 px-2 rounded " + (listening ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700')} onClick={() => {
          if(listening) {
            SpeechRecognition.stopListening();
          }
          else {
            SpeechRecognition.startListening({ continuous: true })
          }
          }}>Turn {listening ? 'off' : 'on'} </button></p>
        <div className=" pt-0 flex-row">
          <label htmlFor="activationPhrase" className='mr-2'>Activation Phrase:</label>
          <input onChange={e => setActivationPhrase(e.target.value)} value={activationPhrase} type="text"className="px-3 py-3 placeholder-slate-300 text-black font-bold uppercase relative bg-gray-200 rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-30 h-5" />
        </div>
      </>)}
      </div>
      <p className={'mt-4'}>{transcript}</p>
    </div>
  );
};
export default Dictaphone;