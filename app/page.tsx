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
          {scene.title && <h1 style={styles.title}>{scene.title}</h1>}

          <div style={styles.imageWrapper}>
            <img src={scene.image} alt="Иллюстрация" style={styles.image} />
          </div>

          <div style={styles.textBox}>
            <p style={styles.text}>{scene.text}</p>
          </div>

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

      {/* Глобальные стили для ховера — безопасно для SSR */}
      <style jsx global>{`
        button {
          transition: all 0.3s ease !important;
        }
        button:hover {
          transform: translateY(-6px) scale(1.03);
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '"Georgia", "Times New Roman", serif',
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
    textAlign: 'center',
    maxWidth: '800px',
    width: '100%',
  },
  title: {
    fontSize: 'clamp(32px, 7vw, 60px)',
    marginBottom: '30px',
    textShadow: '0 4px 15px rgba(0,0,0,0.8)',
    fontWeight: 'bold' as const,
  },
  imageWrapper: {
    margin: '0 auto 35px',
    width: 'fit-content',
    padding: '12px',
    background: 'rgba(20,20,30,0.8)',
    borderRadius: '18px',
    border: '2px solid rgba(180,140,80,0.6)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.7), inset 0 0 20px rgba(180,140,80,0.15)',
    maxWidth: '90vw',
  },
  image: {
    display: 'block',
    width: 'clamp(280px, 80vw, 460px)',
    height: 'auto',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
  },
  textBox: {
    background: 'rgba(0,0,0,0.65)',
    padding: '25px 35px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    marginBottom: '50px',
    backdropFilter: 'blur(8px)',
  },
  text: {
    fontSize: 'clamp(18px, 4vw, 26px)',
    lineHeight: '1.7',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '18px',
    maxWidth: '560px',
    margin: '0 auto',
  },
  button: {
    padding: '18px 30px',
    fontSize: 'clamp(18px, 4vw, 24px)',
    background: 'rgba(255,255,255,0.12)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '15px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: '600' as const,
    backdropFilter: 'blur(10px)',
  },
  restartButton: {
    padding: '20px 40px',
    fontSize: 'clamp(20px, 5vw, 28px)',
    background: '#b8860b',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: 'bold' as const,
  },
};