import TextToSpeech from '../components/TextToSpeech';
import '../public/css/style.css'

const Home = () => {
  return (
    <div className='container'>
      <h1 className='title'>Shorthand Dictation</h1>
      <h3 className='wpm'>100 WPM</h3>
      <TextToSpeech />
    </div>
  );
};

export default Home;
