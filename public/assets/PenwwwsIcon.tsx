type PenwwwsIconProps = {
  size?: number;
  className?: string;
};

function PenwwwsIcon({ size = 25, className = "" }: PenwwwsIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 299 278"
      width={size}
      height={size}
      className={className}
      fill="none"
    >
      <path
        d="M29.9082 233.276C17.4035 228.737 12.7326 213.482 20.5523 202.72L151.496 22.5049L279.031 203.719C286.493 214.321 282.049 229.113 269.979 233.848L202.058 260.494C197.047 262.46 191.339 260.934 187.976 256.731L186.368 254.72C168.624 232.538 134.508 233.755 118.389 257.143C115.71 261.03 110.745 262.618 106.307 261.008L29.9082 233.276ZM145.057 13.3566L145.066 13.369C145.063 13.3649 145.06 13.3607 145.057 13.3566Z"
        stroke="currentColor"
        strokeWidth="32"
      />
    </svg>
  );
}

export default PenwwwsIcon;
