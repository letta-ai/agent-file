'use client';
import Lottie from 'react-lottie';
import { useEffect, useState } from 'react';

interface LettaLoaderProps {
  size?: 'small' | 'medium' | 'large';
}

export function LettaLoader({ size = 'large' }: LettaLoaderProps) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/letta-logo-dark.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);

  const sizeMap = {
    small: 48,
    medium: 64,
    large: 96,
  };

  if (!animationData) {
    return <div style={{ width: sizeMap[size], height: sizeMap[size] }} />;
  }

  const logoOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{ width: sizeMap[size], height: sizeMap[size] }}>
      <Lottie options={logoOptions} isClickToPauseDisabled={true} />
    </div>
  );
}
