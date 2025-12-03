'use client';

import { useState, useEffect, useRef } from 'react';
import storyData from '../data/story.json';

interface Scene {
  title?: string;
  text: string;
  image: string;
  backgroundMusic?: string | null;
  soundEffect?: string | null;
  choices: { text: string; next: string }[];
}

export default function Game() {
  const [currentSceneId, setCurrentSceneId] = useState(storyData.start);
  const scene = storyData.scenes[currentSceneId as keyof typeof storyData.scenes] as Scene;

  const bgRef = useRef<HTMLAudioElement>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (scene.backgroundMusic && bgRef.current) {
      bgRef.current.src = scene.backgroundMusic;
      bgRef.current.loop = true;
      bgRef.current.volume = 0.4;
      bgRef.current.play().catch(() => {});
    }
    if (scene.soundEffect && sfxRef.current) {
      sfxRef.current.src = scene.soundEffect;
      sfxRef.current.volume = 0.7;
      sfxRef.current.play().catch(() => {});
    }
  }, [currentSceneId]);

  const choose = (id: string) => {
    if (bgRef.current) bgRef.current.pause();
    setCurrentSceneId(id);
  };

  const restart = () => setCurrentSceneId(storyData.start);

  return (
    <>
      <div style={styles.page}>
        <div style={styles.bgOverlay} />

        <div style={styles.container}>
          {/* Заголовок */}
          {scene.title && <h1 style={styles.title}>{scene.title}</h1>}

          {/* Картинка — теперь максимально компактная на мобиле */}
          <div style={styles.imageWrapper}>
            <img src={scene.image} alt="" style={styles.image} />
          </div>

          {/* Текст */}
          <div style={styles.textBox}>
            <p style={styles.text}>{scene.text}</p>
          </div>

          {/* Кнопки — всегда прижаты к низу на маленьких экранах */}
          <div style={styles.buttons}>
            {scene.choices.length > 0 ? (
              scene.choices.map((c, i) => (
                <button key={i} onClick={() => choose(c.next)} style={styles.button}>
                  {c.text}
                </button>
              ))
            ) : (
              <button onClick={restart} style={styles.restartButton}>
                Начать сначала
              </button>
            )}
          </div>
        </div>

        <audio ref={bgRef} />
        <audio ref={sfxRef} />
      </div>

      <style jsx global>{`
        button {
          transition: all 0.3s ease !important;
        }
        button:hover,
        button:active {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: 'white',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    fontFamily: '"Georgia", "Times New Roman", serif',
    boxSizing: 'border-box',
  },
  bgOverlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
    zIndex: 1,
  },
  container: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxWidth: '100vw',
    height: '100%',
    padding: '10px 0',
  },
  title: {
    fontSize: 'clamp(28px, 8vw, 56px)',
    margin: '10px 0 15px',
    textAlign: 'center',
    textShadow: '0 4px 15px rgba(0,0,0,0.8)',
    fontWeight: 'bold' as const,
  },
  imageWrapper: {
    margin: '0 auto 20px',
    width: 'fit-content',
    padding: '8px',
    background: 'rgba(20,20,30,0.9)',
    borderRadius: '16px',
    border: '2px solid rgba(180,140,80,0.6)',
    boxShadow: '0 6px 25px rgba(0,0,0,0.7)',
    maxWidth: '92vw',
  },
  image: {
    display: 'block',
    width: 'clamp(220px, 75vw, 400px)',   // ← теперь точно не больше 400px
    height: 'auto',
    maxHeight: '45vh',
    borderRadius: '12px',
    objectFit: 'contain',
  },
  textBox: {
    background: 'rgba(0,0,0,0.7)',
    padding: '18px 22px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.2)',
    margin: '0 10px 20px',
    flex: '1',
    overflowY: 'auto' as const,
    backdropFilter: 'blur(8px)',
  },
  text: {
    fontSize: 'clamp(17px, 4.5vw, 24px)',
    lineHeight: '1.65',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
    padding: '0 15px 15px',
    marginTop: 'auto', // ← прижимает кнопки вниз
  },
  button: {
    padding: '16px 20px',
    fontSize: 'clamp(17px, 4.8vw, 23px)',
    background: 'rgba(255,255,255,0.12)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '14px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: '600' as const,
    backdropFilter: 'blur(10px)',
    minHeight: '56px',
  },
  restartButton: {
    padding: '18px 30px',
    fontSize: 'clamp(19px, 5vw, 26px)',
    background: '#b8860b',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold' as const,
    minHeight: '60px',
  },
};