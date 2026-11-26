import { useId } from 'react';

const FIGURES = {
  estrella: (
    <path
      d="M78.4 133.455L81.5106 140.934L89.5844 141.581L83.433 146.85L85.3124 154.729L78.4 150.507L71.4877 154.729L73.367 146.85L67.2156 141.581L75.2895 140.934L78.4 133.455Z"
      fill="#FFD23F"
    />
  ),
  rayo: (
    <g transform="translate(66.4, 132)">
      <path
        d="M13 2L4 14H11L10 22L19 10H12L13 2Z"
        fill="#FFD23F"
        stroke="#FFD23F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  ),
  ola: (
    <g transform="translate(56.4, 122)">
      <path
        d="M26.5833 22.0013C26.5833 24.5326 24.5313 26.5846 22 26.5846C19.4687 26.5846 17.4167 24.5326 17.4167 22.0013C17.4167 19.47 19.4687 17.418 22 17.418C24.5313 17.418 26.5833 19.47 26.5833 22.0013Z"
        stroke="#FFD23F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 24.7503C16.5 20.1669 27.5 14.6669 30.25 17.4169"
        stroke="#FFD23F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  ),
  hoja: (
    <g transform="translate(56.4, 122)">
      <path
        d="M21.0833 13.75L22.7333 18.5167L27.5 20.1667L22.7333 21.8167L21.0833 26.5833L19.4333 21.8167L14.6667 20.1667L19.4333 18.5167L21.0833 13.75Z"
        fill="#FFD23F"
      />
      <path
        d="M28.4167 23.832L29.15 25.8487L31.1667 26.582L29.15 27.3154L28.4167 29.332L27.6833 27.3154L25.6667 26.582L27.6833 25.8487L28.4167 23.832Z"
        fill="#FFD23F"
      />
    </g>
  ),
  llama: (
    <g transform="translate(56.4, 122)">
      <path
        d="M22 31.1667C25.6666 31.1667 28.4166 28.4167 28.4166 24.75C28.4166 21.0833 25.6666 19.25 24.75 16.5C23.8333 18.3333 22.9166 19.25 22 19.25C22 17.4167 21.0833 15.5833 19.25 13.75C19.25 17.4167 15.5833 19.25 15.5833 24.75C15.5833 28.4167 18.3333 31.1667 22 31.1667Z"
        fill="#FFD23F"
      />
    </g>
  ),
  ojo: (
    <g transform="translate(56.4, 122)">
      <path
        d="M12.8333 21.9987C12.8333 21.9987 16.5 15.582 22 15.582C27.5 15.582 31.1666 21.9987 31.1666 21.9987C31.1666 21.9987 27.5 28.4154 22 28.4154C16.5 28.4154 12.8333 21.9987 12.8333 21.9987Z"
        stroke="#FFD23F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="22" r="2.75" fill="#FFD23F" />
    </g>
  ),
};

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

        {FIGURES[figure] ?? FIGURES.estrella}

        {holographic && (
          <g style={{ mixBlendMode: 'screen' }}>
            <rect width="157" height="182" fill={`url(#${gradientId})`} fillOpacity={0.5} />
          </g>
        )}
      </g>
    </svg>
  );
};