import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PhotoGallery } from './components/PhotoGallery';
import { FloatingHearts } from './components/FloatingHearts';

// Phrases to show when trying to click 'No'
const NO_PHRASES = [
  "No",
  "Don't be shy...",
  "I have chocolate! 🍫",
  "I'm good in bed! (sleeping)",
  "But I bought lingerie...",
  "Think about the massage...",
  "Pretty please? 🍒",
  "I'll do the dishes!",
  "Don't break my heart 💔",
  "Too fast!",
  "Nice try!",
  "I'm slippery!",
  "My mom likes you!",
  "Look at the YES!",
  "Press the green one!",
  "There is no escape 😉",
];

const NAUGHTY_ERRORS = [
  "Not tonight, honey 😉",
  "Access Denied: Premium Content Only 🍑",
  "Reserved for beauty sleep",
  "Try the 14th, you sexy beast",
  "Requires a kiss to unlock",
  "Nope, I'm busy looking cute",
  "My hips are booked",
  "Wrong date, hot stuff",
  "404: Too hot to handle",
  "Authorized personnel only (You) ❤️",
];

const POEM_SLIDES = [
  {
    text: "Roses are red,\nViolets are blue...",
    subtext: "(And this water tower is named after you! 💧)",
    // Updated path: Removed dot, added slash
    image: "https://drive.google.com/uc?export=view&id=1seMHR3dxrIgbI2KwFTat8arRyasM8T7M",
    bgColor: "bg-gradient-to-br from-cyan-100 to-blue-200"
  },
  {
    text: "I rocked your world once...",
    subtext: "😈",
    // Image removed per request
    bgColor: "bg-gradient-to-br from-orange-100 to-amber-200"
  },
  {
    text: "...and we got a souvenir too!",
    subtext: "(The cutest souvenir ever)",
    // Updated path: Removed dot, added slash
    image: "/baby-face.JPG", 
    isBaby: true,
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100"
  },
  {
    text: "Let's do it again? 😉",
    subtext: "Reserve your date below! 👇",
    // Image removed per request
    bgColor: "bg-gradient-to-br from-purple-100 to-red-100"
  }
];

const App: React.FC = () => {
  // App States
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState<{ top: string; left: string } | null>(null);
  
  // Story/Poem States
  const [storyStep, setStoryStep] = useState(0); // 0=Intro/Gallery, 1-4=Poem Slides, 5=Calendar
  
  // Calendar States
  const [shakeDate, setShakeDate] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dateBooked, setDateBooked] = useState(false);

  // Music State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Yes button dynamics - OPTIMIZED FOR MOBILE
  // Slower growth factor (0.2 instead of 1.5)
  const yesButtonScale = 1 + noCount * 0.2;
  // Start bigger (30px), grow more reasonably
  const yesButtonFontSize = Math.min(30 + noCount * 5, 90); 
  const yesZIndex = noCount > 5 ? 100 : 20;

  // --- Music Logic ---
  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Optimistic update not always best for audio, but fine here
        // We set playing true, try to play. If fails, we set false.
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    }
  };

  // --- No Button Logic ---
  const moveNoButton = useCallback(() => {
    const randomTop = Math.floor(Math.random() * 80) + 10;
    const randomLeft = Math.floor(Math.random() * 80) + 10;
    setNoButtonPos({ top: `${randomTop}%`, left: `${randomLeft}%` });
  }, []);

  const handleNoInteraction = (e?: React.SyntheticEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setNoCount(prev => prev + 1);
    moveNoButton();
  };

  useEffect(() => {
    if (noCount > 0 && !accepted) {
      // Slower movement interval (800ms) for better mobile UX
      const interval = setInterval(() => {
        if (Math.random() < 0.2) moveNoButton();
      }, 800);
      return () => clearInterval(interval);
    }
  }, [noCount, accepted, moveNoButton]);

  const handleYesClick = () => {
    setAccepted(true);
    // Try to auto-play music on success if not already playing
    if (audioRef.current && !isPlaying) {
      setTimeout(() => {
        if(audioRef.current) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.log("Auto-play blocked or aborted:", e));
        }
      }, 100);
    }
  };

  // --- Calendar Logic ---
  const handleDateClick = (day: number) => {
    if (day === 14) {
      setDateBooked(true);
      setToastMessage(null);
    } else if (day === 12) {
      // Anniversary Logic
      setShakeDate(day);
      setToastMessage("Happy Anniversary! 💍 (But the main event is the 14th...)");
      setTimeout(() => setShakeDate(null), 2000);
    } else {
      setShakeDate(day);
      setToastMessage(NAUGHTY_ERRORS[Math.floor(Math.random() * NAUGHTY_ERRORS.length)]);
      setTimeout(() => setShakeDate(null), 500);
    }
  };

  // --- Story Flow Control ---
  const advanceStory = () => {
    setStoryStep(prev => prev + 1);
  };

  // --- View Renderers ---
  
  const renderProposal = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative select-none w-full">
      <div className="z-10 flex flex-col items-center gap-6 w-full max-w-md text-center">
        {noCount < 6 && (
          <>
            <div className="w-full h-80 relative mb-4 group perspective-1000">
              <div className="absolute inset-0 bg-pink-500 rounded-3xl transform rotate-3 opacity-20 group-hover:rotate-6 transition-transform"></div>
              {/* FIXED PATH: Removed dot, added slash */}
              <img 
                src="/river-funny.jpg" 
                alt="River being cute" 
                className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute -bottom-6 -right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-4xl animate-bounce z-20 border border-pink-100">
                💌
              </div>
            </div>
            <h1 className="text-6xl font-bold text-red-500 drop-shadow-sm mb-2 font-romantic leading-tight animate-fade-in">
              River...
            </h1>
            <p className="text-2xl text-pink-700 font-handwriting mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Will you be my Valentine?
            </p>
          </>
        )}
        
        <div className="flex flex-col items-center gap-6 w-full relative min-h-[200px] justify-center">
          <button
            onClick={handleYesClick}
            style={{ 
              fontSize: `${yesButtonFontSize}px`,
              transform: `scale(${yesButtonScale})`,
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              zIndex: yesZIndex
            }}
            className={`
              bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 
              text-white font-bold rounded-2xl shadow-xl shadow-green-200/50 px-12 py-6 leading-none 
              ${noCount === 0 ? 'animate-heartbeat' : ''} whitespace-nowrap ring-4 ring-white/50 backdrop-blur-sm
            `}
          >
            Yes! ❤️
          </button>
          
          <div
            style={noButtonPos ? { position: 'fixed', top: noButtonPos.top, left: noButtonPos.left, zIndex: 40 } : { position: 'relative', zIndex: 40 }}
            className="transition-all duration-300 ease-out"
          >
            <div 
              className="absolute -top-16 -left-16 -right-16 -bottom-16 z-50 cursor-pointer"
              onMouseEnter={handleNoInteraction}
              onTouchStart={handleNoInteraction}
              onClick={handleNoInteraction}
            ></div>
            <button className="bg-white/80 backdrop-blur-md text-red-500 border-2 border-red-100 font-bold py-3 px-6 rounded-xl shadow-lg text-lg whitespace-nowrap pointer-events-none">
              {noCount === 0 ? "No" : NO_PHRASES[Math.floor(Math.random() * NO_PHRASES.length)]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="min-h-screen flex flex-col items-center p-4 text-center overflow-y-auto relative animate-fade-in w-full">
      <div className="w-full max-w-4xl flex flex-col items-center gap-6 py-10 z-10">
        <h1 className="text-6xl md:text-8xl font-bold text-red-600 mb-2 drop-shadow-sm animate-bounce font-romantic">
          She said YES! 🎉
        </h1>
        <p className="text-2xl text-pink-700 font-handwriting mb-4">
          (I knew you couldn't resist me)
        </p>
        <PhotoGallery />
        <button 
          onClick={advanceStory}
          className="mt-8 px-10 py-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-2xl font-bold rounded-full shadow-xl hover:scale-105 transition-transform animate-pulse ring-4 ring-white/30"
        >
          Our Story 👉
        </button>
      </div>
    </div>
  );

  const renderStorySlide = () => {
    const slideIndex = storyStep - 1;
    const slide = POEM_SLIDES[slideIndex];
    
    return (
      <div 
        className={`min-h-screen ${slide.bgColor} flex flex-col items-center justify-center p-6 text-center relative w-full overflow-y-auto`}
        onClick={advanceStory}
      >
        <div className="z-10 w-full max-w-md slide-in my-auto">
          <div className="glass-panel p-10 rounded-[2rem] shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-romantic leading-relaxed whitespace-pre-line mb-6">
              "{slide.text}"
            </h2>
            
            {slide.subtext && (
              <p className="text-xl text-pink-600 font-bold mb-4 font-handwriting">{slide.subtext}</p>
            )}

            {/* Only render image if it exists in the slide data */}
            {slide.image && (
              <div className="relative inline-block mt-4 w-full">
                <div className="absolute inset-0 bg-pink-200 rounded-2xl transform rotate-3"></div>
                <img 
                  src={slide.image} 
                  alt={slide.subtext || "Story Image"} 
                  className={`relative z-10 object-cover rounded-2xl shadow-xl border-4 border-white mx-auto ${slide.isBaby ? 'w-64 h-64' : 'w-full max-h-[50vh]'}`}
                />
                {slide.isBaby && <div className="absolute -bottom-6 -right-6 text-5xl animate-bounce z-20">👶</div>}
              </div>
            )}
            
            <div className="mt-8 text-sm text-gray-400 font-semibold uppercase tracking-widest flex items-center justify-center gap-2">
              Tap to continue ➡️
            </div>
          </div>
          
          <div className="flex justify-center gap-3 mt-8">
            {POEM_SLIDES.map((_, idx) => (
              <div key={idx} className={`h-3 rounded-full transition-all duration-300 shadow-sm ${idx === slideIndex ? 'w-8 bg-red-500' : 'w-3 bg-white/50'}`} />
            ))}
            <div className={`h-3 rounded-full transition-all duration-300 w-3 bg-white/50`} />
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-100 flex flex-col items-center justify-center p-4 text-center relative w-full">
      <div className="z-10 w-full max-w-md slide-in">
        <h2 className="text-5xl font-bold text-red-600 mb-6 font-romantic drop-shadow-sm">
          Reserve Your Date
        </h2>
        
        <div className="glass-panel rounded-3xl shadow-2xl p-6 border border-white/60">
          <div className="flex justify-between items-center mb-6 px-4">
            <span className="font-bold text-gray-700 text-2xl font-handwriting">February</span>
            <span className="font-bold text-gray-500 text-xl">2026</span>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['S','M','T','W','T','F','S'].map(d => (
              <div key={d} className="text-gray-400 font-medium text-sm">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(0)].map((_, i) => <div key={`empty-${i}`} />)}
            
            {[...Array(28)].map((_, i) => { 
              const day = i + 1;
              const isValentine = day === 14;
              const isAnniversary = day === 12;
              const isShaking = shakeDate === day;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={dateBooked && !isValentine}
                  className={`
                    aspect-square rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 relative overflow-hidden
                    ${isShaking ? 'animate-shake bg-red-200 text-red-800' : ''}
                    ${isValentine && dateBooked 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white scale-110 shadow-lg ring-4 ring-pink-200' 
                      : isValentine 
                        ? 'bg-pink-100 text-pink-600 hover:bg-pink-200 border-2 border-pink-300 animate-pulse' 
                        : isAnniversary
                          ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
                          : 'text-gray-600 hover:bg-white hover:shadow-md'
                    }
                  `}
                >
                  {isValentine && dateBooked ? '❤️' : day}
                </button>
              );
            })}
          </div>
        </div>

        {toastMessage && (
          <div className="mt-6 py-3 px-6 bg-red-600/90 backdrop-blur-md text-white rounded-2xl shadow-xl animate-bounce font-bold border-2 border-red-400">
            {toastMessage}
          </div>
        )}

        {dateBooked && (
          <div className="mt-8 p-8 glass-panel rounded-3xl shadow-2xl animate-fade-in border-2 border-green-400/50">
            <h3 className="text-4xl font-bold text-green-600 mb-4 font-romantic">It's a Date! 🥂</h3>
            <p className="text-gray-700 text-xl font-handwriting leading-relaxed">
              You, me, and some questionable decisions.<br/>
              <span className="text-sm text-gray-500 font-sans mt-2 block">(Don't worry, the baby is sleeping 😴)</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <>
      <FloatingHearts />
      
      {/* Permanent Music Player */}
      <button 
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg border border-white/50 hover:bg-white/80 transition-all text-2xl"
      >
        {isPlaying ? '🎵' : '🔇'}
      </button>
      <audio ref={audioRef} loop>
        <source src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Gymnopedie_No_1.ogg" type="audio/ogg" />
        {/* Updated Music path too just in case! */}
        <source src="/romantic-music.mp3" type="audio/mpeg" />
      </audio>

      {/* View Switcher */}
      { !accepted ? renderProposal() : 
        storyStep === 0 ? renderGallery() : 
        (storyStep >= 1 && storyStep <= 4) ? renderStorySlide() : 
        renderCalendar() 
      }
    </>
  );
};

export default App;
