import { useId } from 'react';
import EstrellaIcon from '../../../assets/icons/estrella.svg?react';

export const CardIlustration = ({
  colorBase,
  figure,
  holographic = false,
  className = '',
}) => {
  const gradientId = useId();
  const clipId = useId();

  return (
    <svg
      viewBox="0 0 157 182"
      fill="none"
      className={className}
      data-figura={figure}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="157" height="182" />
        </clipPath>
        <linearGradient
          id={gradientId}
          x1="22"
          y1="26"
          x2="155"
          y2="132"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF70D9" />
          <stop offset="0.35" stopColor="#FFE66E" />
          <stop offset="0.65" stopColor="#70FFE8" />
          <stop offset="1" stopColor="#8C7AFF" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {colorBase && <rect width="157" height="182" fill={colorBase} />}

        <path
          d="M78.4 -64.0605L92.9303 11.8506L135.405 -52.7216L119.779 22.9716L183.731 -20.4312L140.328 43.5206L216.021 27.8949L151.449 70.3691L227.36 84.8995L151.449 99.4298L216.021 141.904L140.328 126.278L183.731 190.23L119.779 146.827L135.405 222.521L92.9303 157.948L78.4 233.859L63.8697 157.948L21.3955 222.521L37.0211 146.827L-26.9306 190.23L16.4722 126.278L-59.2211 141.904L5.35112 99.4298L-70.56 84.8995L5.35112 70.3691L-59.2211 27.8949L16.4722 43.5206L-26.9306 -20.4312L37.0211 22.9716L21.3955 -52.7216L63.8697 11.8506L78.4 -64.0605Z"
          fill="white"
          fillOpacity={0.14}
        />

        <circle cx="78.4" cy="80.0402" r="54.88" fill="white" fillOpacity={0.22} />

        <path
          d="M26.656 162.664C26.656 138.659 46.1159 119.199 70.121 119.199H86.6791C110.684 119.199 130.144 138.659 130.144 162.664V183.999H26.656V162.664Z"
          fill="#1A1033"
        />
        <circle cx="78.4" cy="100.383" r="23.52" fill="#1A1033" />
        <rect x="58.1728" y="93.7988" width="40.4544" height="10.3488" rx="5.1744" fill="#FFD23F" />

        <EstrellaIcon
          x={66.4}
          y={132}
          width={24}
          height={24}
          color="#FFD23F"
          fill="#FFD23F"
        />

        {holographic && (
          <g style={{ mixBlendMode: 'screen' }}>
            <rect width="157" height="182" fill={`url(#${gradientId})`} fillOpacity={0.5} />
          </g>
        )}
      </g>
    </svg>
  );
};
