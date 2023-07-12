// import { useState } from 'react';
// import { useSpeechSynthesis } from 'react-speech-kit';
// import '../public/css/style.css'

// const TextToSpeech = () => {
//   const [text, setText] = useState('');
//   const { speak, speaking, cancel } = useSpeechSynthesis();


// const handleStart = () => {
//     const voice = window.speechSynthesis.getVoices()['en-IN-Hinglish-Wavenet-A'];
//     const punctuation = {
//       ',': 'comma',
//       '.': 'period',
//       '?': 'question mark',
//       '!': 'exclamation mark',
//     };
  
//     const textWithPunctuation = text.split('').map((char) => {
//       if (punctuation.hasOwnProperty(char)) {
//         return char + '\u00A0';
//       } else {
//         return char;
//       }
//     }).join('');
  
//     const utterance = new SpeechSynthesisUtterance(textWithPunctuation);
//     utterance.voice = voice;
//     utterance.rate = 0.3;
  
//     // Set the `onboundary` event listener to handle punctuation pronunciation
//     utterance.onboundary = (event) => {
//       const char = event.charIndex > 0 ? textWithPunctuation[event.charIndex - 1] : '';
//       if (punctuation.hasOwnProperty(char)) {
//         const punctuationWord = punctuation[char];
//         const speechSynthesis = window.speechSynthesis;
//         const speechUtteranceChunk = new SpeechSynthesisUtterance(punctuationWord);
//         speechUtteranceChunk.voice = voice;
//         speechUtteranceChunk.rate = 0.2;
//         speechSynthesis.speak(speechUtteranceChunk);
//       }
//     };
  
//     speak(utterance);
//   };
  



//   const handleStop = () => {
//     cancel();
//   };

//   return (
//     <div className='container'>
//       <textarea className='custom-textarea' value={text} onChange={e => setText(e.target.value)} />
//       <button className='rounded-button' onClick={handleStart} disabled={speaking}>
//         Start
//       </button>
//       <button className='rounded-button' onClick={handleStop}>Stop</button>
//     </div>
//   );
// };

// export default TextToSpeech;

import React, { useState, useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import '../public/css/style.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [timer, setTimer] = useState(60); // Timer set to 60 seconds (1 minute)
  const { speak, speaking, cancel } = useSpeechSynthesis();

  useEffect(() => {
    let intervalId;

    // Start the timer when speaking starts
    if (speaking) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    // Stop the speaking when the timer reaches 0
    if (timer === 0) {
      clearInterval(intervalId);
      cancel();
    }

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [speaking, timer, cancel]);

  const handleStart = () => {
    const voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'en-IN-Hinglish-Wavenet-A');
    const punctuation = {
      ',': 'comma',
      '.': 'period',
      '?': 'question mark',
      '!': 'exclamation mark',
    };

    const words = text.trim().split(/\s+/); // Split text into words
    const wordsPerMinute = 100; // Target words per minute
    const speakingTime = Math.ceil((words.length / wordsPerMinute) * 60); // Calculate speaking time in seconds
    const speakingRate = 0.4; // Adjust the speaking rate for a more natural pace

    const textWithPunctuation = words.map((word) => {
      return punctuation.hasOwnProperty(word) ? `${word}\u00A0` : word;
    }).join(' ');

    const utterance = new SpeechSynthesisUtterance(textWithPunctuation);
    utterance.voice = voice;
    utterance.rate = speakingRate; // Set the speaking rate

    setTimer(speakingTime); // Set the timer to the speaking time
    speak(utterance);
  };

  const handleStop = () => {
    cancel();
    setTimer(60); // Reset the timer to 60 seconds (1 minute) when stopped manually
  };

  return (
    <div className='container'>
      <textarea className='custom-textarea' value={text} onChange={e => setText(e.target.value)} />
      <h3 className='timer'>{timer} seconds</h3> {/* Display the timer */}
      <button className='rounded-button' onClick={handleStart} disabled={speaking}>
        Start
      </button>
      <button className='rounded-button' onClick={handleStop}>Stop</button>
    </div>
  );
};

export default TextToSpeech;
