export default function TurboShackLogo({ className = "" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 400 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Turbo Shack Logo"
        >
            {/* Icon: Checkered flag / Track abstract S-curve */}
            <path
                d="M20 20 L50 20 L50 40 L20 40 Z"
                fill="#FF0000"
            />
            <path
                d="M50 40 L80 40 L80 60 L50 60 Z"
                fill="#FF0000"
            />
            <path
                d="M20 60 L50 60 L50 80 L20 80 Z"
                fill="#FF0000"
            />
            {/* Stylized Track Curve */}
            <path
                d="M90 20 C140 20, 110 90, 160 90 H240 L230 110 H140 C80 110, 110 40, 60 40 H20 V20 H90 Z"
                fill="#FF0000"
            />

            {/* Text: TURBO */}
            <text
                x="170"
                y="50"
                fill="#FF0000"
                fontSize="40"
                fontFamily="sans-serif"
                fontWeight="900"
                fontStyle="italic"
                letterSpacing="2"
            >
                TURBO
            </text>

            {/* Text: SHACK */}
            <text
                x="200"
                y="90"
                fill="#FF0000"
                fontSize="40"
                fontFamily="sans-serif"
                fontWeight="900"
                fontStyle="italic"
                letterSpacing="2"
            >
                SHACK
            </text>

            {/* Tagline */}
            <text
                x="170"
                y="115"
                fill="#FF0000"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="700"
                fontStyle="italic"
                letterSpacing="1"
            >
                TAKE CONTROL. LIKE A PRO
            </text>
        </svg>
    );
}
