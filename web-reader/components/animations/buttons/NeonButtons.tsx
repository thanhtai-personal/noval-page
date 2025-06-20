import styles from "./NeonButtons.module.css";

const Neon = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnNeon}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Explosion = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnExplosion}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Liquid = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnLiquid}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Split = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnSplit}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Morph = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnMorph}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Shake = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnShake}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Glitch = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnGlitch}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Lightning = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnLightning}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Pulse = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnPulse}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Blur = ({ children, className, ...props }: any) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.btnBlur}>
        <div className="w-full px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

const Example = () => {
  return (
    <div className="neon-buttons">
      <h1>Spectacular Hover Effect Buttons</h1>
      <p className="subtitle">12 Amazing Button Effects</p>

      <div className={styles.container}>
        <div className={styles.btnContainer}>
          <button className={styles.btnNeon}>1. NEON GLOW</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnExplosion}>2. EXPLOSIVE</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnLiquid}>3. LIQUID MORPH</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnSplit}>4. SPLIT EFFECT</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnOutline}>5. FILL REVEAL</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnShake}>6. SHAKE IT</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnLightning}>7. LIGHTNING</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnPulse}>9. PULSE BEAT</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnBlur}>10. ZOOM BLUR</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnGlitch}>11. GLITCH</button>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.btnMorph}>12. MORPH</button>
        </div>
      </div>
    </div>
  );
};

export default {
  Neon,
  Explosion,
  Liquid,
  Split,
  Morph,
  Shake,
  Glitch,
  Lightning,
  Pulse,
  Blur,
  Example,
};
