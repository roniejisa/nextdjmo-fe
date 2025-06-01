export const reactions = [
  {
    type: "like",
    color: "#1877f2",
    name: "Thích",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 rounded-full">
        <defs>
          {/* Gradient cho hiệu ứng 3D của hình tròn */}
          <radialGradient id="circle3DGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#72a7f9" />
            <stop offset="50%" stopColor="#1877f2" />
            <stop offset="100%" stopColor="#2465ff" />
          </radialGradient>

          {/* Gradient cho bóng đổ hình tròn */}
          <radialGradient id="circleShadowGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(24, 119, 242, 0.3)" />
            <stop offset="100%" stopColor="rgba(24, 119, 242, 0)" />
          </radialGradient>

          {/* Gradient cho hiệu ứng 3D của ngón tay - sáng hơn */}
          <linearGradient
            id="thumb3DGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fafafa" />
            <stop offset="70%" stopColor="#f0f0f0" />
            <stop offset="100%" stopColor="#e0e0e0" />
          </linearGradient>

          {/* Gradient cho highlight của ngón tay - sáng hơn */}
          <linearGradient id="thumbHighlight" x1="0%" y1="0%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
          </linearGradient>

          {/* Filter cho bóng đổ */}
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="2" dy="4" result="offset" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Filter cho inner shadow */}
          <filter id="innerShadow">
            <feOffset in="SourceAlpha" dx="1" dy="2" />
            <feGaussianBlur stdDeviation="1" result="offset-blur" />
            <feComposite in="SourceGraphic" in2="offset-blur" operator="out" />
          </filter>
        </defs>

        {/* Bóng đổ cho hình tròn */}
        <ellipse
          cx="13"
          cy="15"
          rx="11"
          ry="10"
          fill="url(#circleShadowGradient)"
          opacity="0.4"
        />

        {/* Hình tròn nền 3D */}
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="url(#circle3DGradient)"
          filter="url(#dropShadow)"
        >
          <animate
            attributeName="r"
            values="11;12;11"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Highlight trên cùng của hình tròn */}
        <ellipse
          cx="9"
          cy="8"
          rx="4"
          ry="3"
          fill="url(#thumbHighlight)"
          opacity="0.6"
        />

        {/* Bóng đổ cho ngón tay */}
        <path
          fill="rgba(0,0,0,0.15)"
          d="M8.493 19.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 017 16.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V4a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H15.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM3.331 11.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H5.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H5.25c-.832 0-1.612.453-1.918 1.227z"
        />

        {/* Ngón tay chính với hiệu ứng 3D trắng sáng */}
        <path
          fill="url(#thumb3DGradient)"
          filter="url(#dropShadow)"
          d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z"
          transform="rotate(-25 12 12) translate(-1.5, -1)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-25 12 12;-15 12 12;-25 12 12"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-1.5,-1;-0.5,-0.5;-1.5,-1"
            dur="1.5s"
            repeatCount="indefinite"
            additive="sum"
          />
        </path>

        {/* Highlight chính cho ngón tay - sáng hơn */}
        <path
          fill="url(#thumbHighlight)"
          opacity="0.95"
          d="M8.2 16.5c0-1.1.4-2.1 1-2.9.2-.2.4-.4.6-.4.3-.1.5-.3.7-.5a5.5 5.5 0 011.7-1.4c.4-.2.8-.6 1-1.1.2-.3.2-.8.2-1.2 0-.2.1-.4.2-.4.7 0 1.3.6 1.3 1.3 0 .7-.2 1.3-.4 1.9-.1.3 0 .6.3.6h1.8c.6 0 1.1.4 1.2 1 0 .2 0 .5 0 .8a7 7 0 01-1.6 4.4c-.2.3-.5.4-.9.4h-1.7c-.3 0-.5-.1-.8-.2l-1.8-.6c-.3-.1-.5-.1-.8-.1H8.2z"
          transform="rotate(-25 12 12) translate(-1.5, -1)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-25 12 12;-15 12 12;-25 12 12"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-1.5,-1;-0.5,-0.5;-1.5,-1"
            dur="1.5s"
            repeatCount="indefinite"
            additive="sum"
          />
        </path>

        {/* Điểm sáng trên đốt ngón tay - sáng hơn */}
        <ellipse
          cx="11"
          cy="13"
          rx="2"
          ry="1.2"
          fill="#ffffff"
          opacity="0.95"
          transform="rotate(-25 12 12) translate(-1.5, -1)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-25 12 12;-15 12 12;-25 12 12"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-1.5,-1;-0.5,-0.5;-1.5,-1"
            dur="1.5s"
            repeatCount="indefinite"
            additive="sum"
          />
        </ellipse>

        {/* Thêm các điểm sáng bổ sung */}
        <circle
          cx="12"
          cy="11"
          r="0.8"
          fill="#ffffff"
          opacity="0.7"
          transform="rotate(-25 12 12) translate(-1.5, -1)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-25 12 12;-15 12 12;-25 12 12"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-1.5,-1;-0.5,-0.5;-1.5,-1"
            dur="1.5s"
            repeatCount="indefinite"
            additive="sum"
          />
        </circle>

        <circle
          cx="10"
          cy="15"
          r="0.5"
          fill="#ffffff"
          opacity="0.8"
          transform="rotate(-25 12 12) translate(-1.5, -1)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-25 12 12;-15 12 12;-25 12 12"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-1.5,-1;-0.5,-0.5;-1.5,-1"
            dur="1.5s"
            repeatCount="indefinite"
            additive="sum"
          />
        </circle>

        {/* Sparkles hiệu ứng */}
        <g opacity="0.9">
          <circle cx="6" cy="6" r="1" fill="#FFD700">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0s"
            />
            <animate
              attributeName="r"
              values="0.8;1.2;0.8"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0s"
            />
          </circle>
          <circle cx="18" cy="8" r="0.8" fill="#FFD700">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="r"
              values="0.6;1;0.6"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </circle>
          <circle cx="19" cy="16" r="1.2" fill="#FFD700">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.5s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="r"
              values="1;1.4;1"
              dur="1.5s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
        </g>
      </svg>
    ),
  },
  {
    type: "love",
    color: "#f33e58",
    name: "Yêu thích",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 rounded-full">
        <defs>
          <radialGradient id="loveGradient" cx="40%" cy="25%" r="80%">
            <stop offset="0%" stopColor="#FF8FB3">
              <animate
                attributeName="stop-color"
                values="#FF8FB3;#FF4569;#FF8FB3"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="70%" stopColor="#FF1E7A">
              <animate
                attributeName="stop-color"
                values="#FF1E7A;#E91E63;#FF1E7A"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#C2185B">
              <animate
                attributeName="stop-color"
                values="#C2185B;#AD1457;#C2185B"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </stop>
          </radialGradient>

          <linearGradient id="highlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </linearGradient>

          <radialGradient id="shadowGradient" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
          </radialGradient>

          <filter
            id="loveShadow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="4" result="offset" />
            <feFlood floodColor="#E91E63" floodOpacity="0.3" />
            <feComposite in2="offset" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feFlood floodColor="#8E0A3D" floodOpacity="0.4" />
            <feComposite in2="SourceGraphic" operator="out" />
            <feGaussianBlur stdDeviation="2" />
            <feOffset dx="0" dy="2" />
            <feComposite in2="SourceGraphic" operator="atop" />
          </filter>
        </defs>

        <ellipse
          cx="12"
          cy="15"
          rx="10"
          ry="3"
          fill="url(#shadowGradient)"
          opacity="0.4"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.1;1;1.05;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>

        <circle
          cx="12"
          cy="12"
          r="11"
          fill="url(#loveGradient)"
          filter="url(#loveShadow)"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.2;1;1.05;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        <ellipse
          cx="9"
          cy="8"
          rx="4"
          ry="6"
          fill="url(#highlight)"
          opacity="0.7"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.1;1;1.05;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>

        <path
          fill="#FFFFFF"
          d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
          filter="url(#innerShadow)"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.1;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill"
            values="#FFFFFF;#FFFAFC;#FFFFFF"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        <path
          fill="#FFFFFF"
          d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
          opacity="0.8"
          transform="translate(-0.5, -1)"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.05;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        <g opacity="0.9">
          <g>
            <path d="M6 4l-1 1h2z" fill="#FFFFFF" filter="url(#loveShadow)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;-2,-8;0,0"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0.3;0.9"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill"
                values="#FFFFFF;#FFFBFC;#FFFFFF"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M5.5 3.5l-0.5 0.5h1z" fill="#FFFFFF" opacity="1">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;-2,-8;0,0"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          <g>
            <path d="M18 6l-1 1h2z" fill="#FFFFFF" filter="url(#loveShadow)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;2,-6;0,0"
                dur="2.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0.3;0.9"
                dur="2.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill"
                values="#FFFFFF;#FFFBFC;#FFFFFF"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M17.5 5.5l-0.5 0.5h1z" fill="#FFFFFF" opacity="1">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;2,-6;0,0"
                dur="2.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          <g>
            <path d="M20 14l-1 1h2z" fill="#FFFFFF" filter="url(#loveShadow)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;1,-5;0,0"
                dur="1.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.9;0.3;0.9"
                dur="1.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="fill"
                values="#FFFFFF;#FFFBFC;#FFFFFF"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M19.5 13.5l-0.5 0.5h1z" fill="#FFFFFF" opacity="1">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0;1,-5;0,0"
                dur="1.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>

        <g opacity="0.9">
          <circle cx="16" cy="4" r="0.8" fill="#FFFFFF">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values="0.5;1.2;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="4" cy="10" r="0.6" fill="#FFFFFF">
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values="0.8;1.3;0.8"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="20" cy="20" r="0.7" fill="#FFFFFF">
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2.2s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values="0.6;1.4;0.6"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="6" cy="18" r="0.5" fill="#FFFFFF">
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="1.8s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values="0.4;1.1;0.4"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    ),
  },
  {
  type: "haha",
  color: "#ffa726",
  name: "HAHA",
  icon: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 rounded-full">
      <defs>
        {/* Gradient cho nền vàng cam vui vẻ */}
        <radialGradient id="hahaCircleGradient" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="50%" stopColor="#FFA726" />
          <stop offset="100%" stopColor="#FF8F00" />
        </radialGradient>

        {/* Gradient cho ánh sáng vui vẻ */}
        <radialGradient id="hahaGlowGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFD54F" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFA726" stopOpacity="0.2" />
        </radialGradient>

        {/* Filter cho hiệu ứng sáng */}
        <filter id="hahaGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient cho nước mắt vui */}
        <radialGradient id="tearGradient" cx="30%" cy="20%">
          <stop offset="0%" stopColor="#E3F2FD" />
          <stop offset="50%" stopColor="#BBDEFB" />
          <stop offset="100%" stopColor="#2196F3" />
        </radialGradient>
      </defs>

      {/* Ánh sáng nền rung rinh */}
      <circle
        cx="12"
        cy="12"
        r="16"
        fill="url(#hahaGlowGradient)"
        opacity="0.5"
      >
        <animate
          attributeName="r"
          values="16;19;16"
          dur="0.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0.2;0.5"
          dur="0.8s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 12 12;5 12 12;-5 12 12;0 12 12"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Shadow nhảy nhót */}
      <ellipse
        cx="13"
        cy="15"
        rx="11"
        ry="9"
        fill="rgba(255, 143, 0, 0.3)"
        opacity="0.6"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;2,1;-1,0;0,0"
          dur="0.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="rx"
          values="11;12;10;11"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Hình tròn nền chính */}
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="url(#hahaCircleGradient)"
        filter="url(#hahaGlow)"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;1,0;-1,0;0,1;0,-1;0,0"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="11;11.5;10.8;11"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Highlight */}
      <ellipse cx="9" cy="8" rx="4" ry="3" fill="#FFFFFF" opacity="0.6">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;1,0;-1,0;0,0"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Mắt cười nhắm - trái */}
      <g>
        <path
          d="M6.5 9 Q8.5 11 10.5 9"
          stroke="#8B4513"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-width"
            values="2.5;3;2.5"
            dur="0.3s"
            repeatCount="indefinite"
          />
        </path>
        {/* Nếp nhăn mắt cười */}
        <path
          d="M6 8.5 Q8.5 10 11 8.5"
          stroke="#8B4513"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Mắt cười nhắm - phải */}
      <g>
        <path
          d="M13.5 9 Q15.5 11 17.5 9"
          stroke="#8B4513"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-width"
            values="2.5;3;2.5"
            dur="0.3s"
            repeatCount="indefinite"
          />
        </path>
        {/* Nếp nhăn mắt cười */}
        <path
          d="M13 8.5 Q15.5 10 18 8.5"
          stroke="#8B4513"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Miệng cười lớn */}
      <path
        d="M6 14 Q12 20 18 14"
        stroke="#8B4513"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;1,0;-1,0;0,0"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="d"
          values="M6 14 Q12 20 18 14;M6 14 Q12 21 18 14;M6 14 Q12 19 18 14;M6 14 Q12 20 18 14"
          dur="0.4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Nội miệng */}
      <path
        d="M7 15 Q12 19 17 15"
        fill="#8B4513"
        opacity="0.4"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;1,0;-1,0;0,0"
          dur="0.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="d"
          values="M7 15 Q12 19 17 15;M7 15 Q12 20 17 15;M7 15 Q12 18 17 15;M7 15 Q12 19 17 15"
          dur="0.4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Răng cười */}
      <g fill="#FFFFFF">
        <rect x="9" y="16" width="1" height="2" rx="0.5">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="11" y="16.5" width="1" height="2" rx="0.5">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="13" y="16.5" width="1" height="2" rx="0.5">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="15" y="16" width="1" height="2" rx="0.5">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      {/* Nước mắt cười - trái */}
      <g>
        <ellipse cx="5" cy="11" rx="1" ry="2" fill="url(#tearGradient)" opacity="0.8">
          <animate
            attributeName="ry"
            values="2;3;1;2"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="11;13;15;11"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.4;0;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Giọt nước mắt nhỏ */}
        <circle cx="4.5" cy="13" r="0.5" fill="url(#tearGradient)">
          <animate
            attributeName="cy"
            values="13;16;13"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
          <animate
            attributeName="opacity"
            values="0.6;0;0.6"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>
      </g>

      {/* Nước mắt cười - phải */}
      <g>
        <ellipse cx="19" cy="11" rx="1" ry="2" fill="url(#tearGradient)" opacity="0.8">
          <animate
            attributeName="ry"
            values="2;3;1;2"
            dur="1s"
            repeatCount="indefinite"
            begin="0.3s"
          />
          <animate
            attributeName="cy"
            values="11;13;15;11"
            dur="2s"
            repeatCount="indefinite"
            begin="0.3s"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.4;0;0.8"
            dur="2s"
            repeatCount="indefinite"
            begin="0.3s"
          />
        </ellipse>
        {/* Giọt nước mắt nhỏ */}
        <circle cx="19.5" cy="13" r="0.5" fill="url(#tearGradient)">
          <animate
            attributeName="cy"
            values="13;16;13"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.8s"
          />
          <animate
            attributeName="opacity"
            values="0.6;0;0.6"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.8s"
          />
        </circle>
      </g>

      {/* Text "HAHA" bay lên */}
      <g opacity="0.9" fontSize="4" fontWeight="bold" fontFamily="Arial, sans-serif">
        <text x="12" y="4" textAnchor="middle" fill="#FF8F00">
          HAHA
          <animate
            attributeName="y"
            values="4;2;0;4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9;0.5;0.2;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.2;0.8;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </text>
      </g>

      {/* Hiệu ứng lấp lánh xung quanh */}
      <g opacity="0.8">
        {/* Sparkle 1 */}
        <g>
          <path d="M3 5 L3.8 6.2 L5 5 L3.8 3.8 Z" fill="#FFD700">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 4 5;360 4 5"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M4 3.5 L4 6.5 M2.5 5 L5.5 5"
            stroke="#FFD700"
            strokeWidth="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 4 5;360 4 5"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/* Sparkle 2 */}
        <g>
          <path d="M21 7 L21.8 8.2 L23 7 L21.8 5.8 Z" fill="#FFD700">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 22 7;360 22 7"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </path>
          <path
            d="M22 5.5 L22 8.5 M20.5 7 L23.5 7"
            stroke="#FFD700"
            strokeWidth="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 22 7;360 22 7"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </path>
        </g>

        {/* Sparkle 3 */}
        <g>
          <path d="M2 19 L2.8 20.2 L4 19 L2.8 17.8 Z" fill="#FFD700">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 3 19;360 3 19"
              dur="1.5s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              repeatCount="indefinite"
              begin="1s"
            />
          </path>
          <path
            d="M3 17.5 L3 20.5 M1.5 19 L4.5 19"
            stroke="#FFD700"
            strokeWidth="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 3 19;360 3 19"
              dur="1.5s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              repeatCount="indefinite"
              begin="1s"
            />
          </path>
        </g>

        {/* Sparkle 4 */}
        <g>
          <path d="M22 19 L22.8 20.2 L24 19 L22.8 17.8 Z" fill="#FFD700">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 23 19;360 23 19"
              dur="1.5s"
              repeatCount="indefinite"
              begin="1.5s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              repeatCount="indefinite"  
              begin="1.5s"
            />
          </path>
          <path
            d="M23 17.5 L23 20.5 M21.5 19 L24.5 19"
            stroke="#FFD700"
            strokeWidth="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 23 19;360 23 19"
              dur="1.5s"
              repeatCount="indefinite"
              begin="1.5s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              repeatCount="indefinite"
              begin="1.5s"
            />
          </path>
        </g>
      </g>

      {/* Hiệu ứng sóng cười */}
      <circle
        cx="12"
        cy="12"
        r="13"
        fill="none"
        stroke="#FFD700"
        strokeWidth="0.5"
        opacity="0.4"
      >
        <animate
          attributeName="r"
          values="13;17;13"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0;0.4"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Sóng thứ hai */}
      <circle
        cx="12"
        cy="12"
        r="15"
        fill="none"
        stroke="#FFA726"
        strokeWidth="0.3"
        opacity="0.3"
      >
        <animate
          attributeName="r"
          values="15;19;15"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  ),
},
  {
    type: "sad",
    color: "#4FC3F7",
    name: "Khóc òa",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 rounded-full">
        <defs>
          {/* Gradient cho nền xanh buồn */}
          <radialGradient id="cryCircleGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#81D4FA" />
            <stop offset="50%" stopColor="#4FC3F7" />
            <stop offset="100%" stopColor="#0288D1" />
          </radialGradient>

          {/* Gradient cho nước mắt */}
          <radialGradient id="tearGradient" cx="30%" cy="20%">
            <stop offset="0%" stopColor="#E3F2FD" />
            <stop offset="30%" stopColor="#BBDEFB" />
            <stop offset="70%" stopColor="#2196F3" />
            <stop offset="100%" stopColor="#1565C0" />
          </radialGradient>

          {/* Gradient cho mây mưa */}
          <radialGradient id="cloudGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#ECEFF1" />
            <stop offset="50%" stopColor="#B0BEC5" />
            <stop offset="100%" stopColor="#607D8B" />
          </radialGradient>

          {/* Filter cho hiệu ứng mờ ảo */}
          <filter id="cryBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient cho giọt mưa */}
          <linearGradient id="rainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E3F2FD" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2196F3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1565C0" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Mây mưa phía trên */}
        <g opacity="0.8">
          <ellipse cx="12" cy="2" rx="8" ry="3" fill="url(#cloudGradient)">
            <animate
              attributeName="rx"
              values="8;10;8"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="ry"
              values="3;4;3"
              dur="3s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="8" cy="3" rx="4" ry="2" fill="url(#cloudGradient)">
            <animate
              attributeName="rx"
              values="4;5;4"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="16" cy="3" rx="4" ry="2" fill="url(#cloudGradient)">
            <animate
              attributeName="rx"
              values="4;5;4"
              dur="2.5s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </ellipse>
        </g>

        {/* Giọt mưa rơi */}
        <g opacity="0.7">
          <ellipse cx="6" cy="8" rx="0.3" ry="2" fill="url(#rainGradient)">
            <animate
              attributeName="cy"
              values="8;24;8"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="9" cy="6" rx="0.3" ry="2" fill="url(#rainGradient)">
            <animate
              attributeName="cy"
              values="6;22;6"
              dur="1.8s"
              repeatCount="indefinite"
              begin="0.3s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.8s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </ellipse>
          <ellipse cx="15" cy="6" rx="0.3" ry="2" fill="url(#rainGradient)">
            <animate
              attributeName="cy"
              values="6;22;6"
              dur="1.6s"
              repeatCount="indefinite"
              begin="0.6s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.6s"
              repeatCount="indefinite"
              begin="0.6s"
            />
          </ellipse>
          <ellipse cx="18" cy="8" rx="0.3" ry="2" fill="url(#rainGradient)">
            <animate
              attributeName="cy"
              values="8;24;8"
              dur="1.4s"
              repeatCount="indefinite"
              begin="0.9s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.4s"
              repeatCount="indefinite"
              begin="0.9s"
            />
          </ellipse>
        </g>

        {/* Shadow run nước mắt */}
        <ellipse
          cx="13"
          cy="16"
          rx="12"
          ry="8"
          fill="rgba(2, 136, 209, 0.3)"
          opacity="0.5"
        >
          <animate
            attributeName="ry"
            values="8;10;8"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Hình tròn nền chính */}
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="url(#cryCircleGradient)"
          filter="url(#cryBlur)"
        >
          <animate
            attributeName="fill"
            values="url(#cryCircleGradient);#29B6F6;url(#cryCircleGradient)"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Highlight ướt */}
        <ellipse cx="9" cy="8" rx="3.5" ry="2.5" fill="#FFFFFF" opacity="0.4">
          <animate
            attributeName="opacity"
            values="0.4;0.6;0.4"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Mắt khóc - trái */}
        <ellipse
          cx="8.5"
          cy="9.5"
          rx="2"
          ry="2.5"
          fill="#FFFFFF"
          stroke="#607D8B"
          strokeWidth="1"
        >
          <animate
            attributeName="ry"
            values="2.5;3;2.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="8.5" cy="9.8" rx="1.2" ry="1.5" fill="#1565C0">
          <animate
            attributeName="ry"
            values="1.5;1.8;1.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </ellipse>
        <circle cx="8.8" cy="9.2" r="0.4" fill="#FFFFFF" opacity="0.9" />

        {/* Mắt khóc - phải */}
        <ellipse
          cx="15.5"
          cy="9.5"
          rx="2"
          ry="2.5"
          fill="#FFFFFF"
          stroke="#607D8B"
          strokeWidth="1"
        >
          <animate
            attributeName="ry"
            values="2.5;3;2.5"
            dur="1s"
            repeatCount="indefinite"
            begin="0.2s"
          />
        </ellipse>
        <ellipse cx="15.5" cy="9.8" rx="1.2" ry="1.5" fill="#1565C0">
          <animate
            attributeName="ry"
            values="1.5;1.8;1.5"
            dur="1s"
            repeatCount="indefinite"
            begin="0.2s"
          />
        </ellipse>
        <circle cx="15.8" cy="9.2" r="0.4" fill="#FFFFFF" opacity="0.9" />

        {/* Lông mày buồn - trái */}
        <path
          d="M6 7 Q8.5 5.5 11 7"
          stroke="#455A64"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M6 7 Q8.5 5.5 11 7;M6 6.5 Q8.5 5 11 6.5;M6 7 Q8.5 5.5 11 7"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Lông mày buồn - phải */}
        <path
          d="M13 7 Q15.5 5.5 18 7"
          stroke="#455A64"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M13 7 Q15.5 5.5 18 7;M13 6.5 Q15.5 5 18 6.5;M13 7 Q15.5 5.5 18 7"
            dur="2s"
            repeatCount="indefinite"
            begin="0.3s"
          />
        </path>

        {/* Nước mắt lớn - trái */}
        <ellipse
          cx="6"
          cy="13"
          rx="1.5"
          ry="4"
          fill="url(#tearGradient)"
          opacity="0.9"
        >
          <animate
            attributeName="cy"
            values="13;20;13"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values="4;6;4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9;0.5;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Nước mắt lớn - phải */}
        <ellipse
          cx="18"
          cy="13"
          rx="1.5"
          ry="4"
          fill="url(#tearGradient)"
          opacity="0.9"
        >
          <animate
            attributeName="cy"
            values="13;20;13"
            dur="2s"
            repeatCount="indefinite"
            begin="0.5s"
          />
          <animate
            attributeName="ry"
            values="4;6;4"
            dur="2s"
            repeatCount="indefinite"
            begin="0.5s"
          />
          <animate
            attributeName="opacity"
            values="0.9;0.5;0.9"
            dur="2s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </ellipse>

        {/* Nước mắt nhỏ rơi */}
        <g opacity="0.8">
          <circle cx="7" cy="18" r="0.8" fill="url(#tearGradient)">
            <animate
              attributeName="cy"
              values="18;24;18"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="0.8;1.2;0.8"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="17" cy="18" r="0.8" fill="url(#tearGradient)">
            <animate
              attributeName="cy"
              values="18;24;18"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.7s"
            />
            <animate
              attributeName="r"
              values="0.8;1.2;0.8"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.7s"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.7s"
            />
          </circle>
        </g>

        {/* Miệng buồn */}
        <path
          d="M8 17 Q12 15 16 17"
          stroke="#455A64"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M8 17 Q12 15 16 17;M8 17.5 Q12 15.5 16 17.5;M8 17 Q12 15 16 17"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Hiệu ứng sóng buồn */}
        <circle
          cx="12"
          cy="12"
          r="13"
          fill="none"
          stroke="#4FC3F7"
          strokeWidth="0.8"
          opacity="0.4"
        >
          <animate
            attributeName="r"
            values="13;17;13"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0;0.4"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Bong bóng nước mắt */}
        <g opacity="0.6">
          <circle cx="4" cy="20" r="1" fill="url(#tearGradient)">
            <animate
              attributeName="cy"
              values="20;4;20"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="1;0.5;1"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="20" cy="22" r="1.2" fill="url(#tearGradient)">
            <animate
              attributeName="cy"
              values="22;2;22"
              dur="5s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="r"
              values="1.2;0.6;1.2"
              dur="5s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0"
              dur="5s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
        </g>

        {/* Hiệu ứng chữ "SOB" bay lên */}
        <text
          x="10"
          y="22"
          fill="#1565C0"
          fontSize="2.5"
          fontWeight="bold"
          fontFamily="Arial"
          opacity="0.7"
        >
          SOB
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;-1,-8;-2,-16"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.9;0"
            dur="4s"
            repeatCount="indefinite"
          />
        </text>
      </svg>
    ),
  },
  {
    type: "wow",
    color: "#f7b928",
    name: "Wow",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 rounded-full">
        <defs>
          {/* Gradient cho nền vàng ngạc nhiên */}
          <radialGradient id="wowCircleGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="50%" stopColor="#F7B928" />
            <stop offset="100%" stopColor="#E6A000" />
          </radialGradient>

          {/* Gradient cho ánh sáng ngạc nhiên */}
          <radialGradient id="wowGlowGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFE066" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F7B928" stopOpacity="0.1" />
          </radialGradient>

          {/* Filter cho hiệu ứng sáng */}
          <filter id="wowGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ánh sáng nền */}
        <circle
          cx="12"
          cy="12"
          r="15"
          fill="url(#wowGlowGradient)"
          opacity="0.6"
        >
          <animate
            attributeName="r"
            values="15;18;15"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.3;0.6"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Shadow */}
        <ellipse
          cx="13"
          cy="15"
          rx="11"
          ry="9"
          fill="rgba(230, 160, 0, 0.3)"
          opacity="0.5"
        />

        {/* Hình tròn nền */}
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="url(#wowCircleGradient)"
          filter="url(#wowGlow)"
        >
          <animate
            attributeName="r"
            values="11;11.5;11"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Highlight */}
        <ellipse cx="9" cy="8" rx="4" ry="3" fill="#FFFFFF" opacity="0.5" />

        {/* Mắt to ngạc nhiên - trái */}
        <circle
          cx="8.5"
          cy="10"
          r="2.5"
          fill="#FFFFFF"
          stroke="#2E2E2E"
          strokeWidth="0.5"
        >
          <animate
            attributeName="r"
            values="2.5;3;2.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="8.5" cy="10" r="1.5" fill="#2E2E2E">
          <animate
            attributeName="r"
            values="1.5;1.8;1.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="8.8" cy="9.5" r="0.5" fill="#FFFFFF" opacity="0.9" />

        {/* Mắt to ngạc nhiên - phải */}
        <circle
          cx="15.5"
          cy="10"
          r="2.5"
          fill="#FFFFFF"
          stroke="#2E2E2E"
          strokeWidth="0.5"
        >
          <animate
            attributeName="r"
            values="2.5;3;2.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="15.5" cy="10" r="1.5" fill="#2E2E2E">
          <animate
            attributeName="r"
            values="1.5;1.8;1.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="15.8" cy="9.5" r="0.5" fill="#FFFFFF" opacity="0.9" />

        {/* Lông mày ngạc nhiên - trái */}
        <path
          d="M6 6.5 Q8.5 5 11 6.5"
          stroke="#8B4513"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M6 6.5 Q8.5 5 11 6.5;M6 5.5 Q8.5 4 11 5.5;M6 6.5 Q8.5 5 11 6.5"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Lông mày ngạc nhiên - phải */}
        <path
          d="M13 6.5 Q15.5 5 18 6.5"
          stroke="#8B4513"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M13 6.5 Q15.5 5 18 6.5;M13 5.5 Q15.5 4 18 5.5;M13 6.5 Q15.5 5 18 6.5"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Miệng ngạc nhiên - hình oval */}
        <ellipse
          cx="12"
          cy="16"
          rx="2"
          ry="3"
          fill="#2E2E2E"
          stroke="#8B4513"
          strokeWidth="1"
        >
          <animate
            attributeName="ry"
            values="3;3.5;3"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values="2;2.2;2"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Highlight trong miệng */}
        <ellipse
          cx="11.5"
          cy="15.5"
          rx="0.5"
          ry="1"
          fill="#FFFFFF"
          opacity="0.4"
        />

        {/* Hiệu ứng sparkle xung quanh */}
        <g opacity="0.8">
          {/* Sparkle 1 */}
          <g>
            <path d="M4 8 L4.8 9.2 L6 8 L4.8 6.8 Z" fill="#FFD700">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 5 8;360 5 8"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M5 6.5 L5 9.5 M3.5 8 L6.5 8"
              stroke="#FFD700"
              strokeWidth="0.5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 5 8;360 5 8"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Sparkle 2 */}
          <g>
            <path d="M20 6 L20.8 7.2 L22 6 L20.8 4.8 Z" fill="#FFD700">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 21 6;360 21 6"
                dur="2s"
                repeatCount="indefinite"
                begin="0.5s"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0.5s"
              />
            </path>
            <path
              d="M21 4.5 L21 7.5 M19.5 6 L22.5 6"
              stroke="#FFD700"
              strokeWidth="0.5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 21 6;360 21 6"
                dur="2s"
                repeatCount="indefinite"
                begin="0.5s"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0.5s"
              />
            </path>
          </g>

          {/* Sparkle 3 */}
          <g>
            <path d="M3 18 L3.8 19.2 L5 18 L3.8 16.8 Z" fill="#FFD700">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 4 18;360 4 18"
                dur="2s"
                repeatCount="indefinite"
                begin="1s"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.5s"
                repeatCount="indefinite"
                begin="1s"
              />
            </path>
            <path
              d="M4 16.5 L4 19.5 M2.5 18 L5.5 18"
              stroke="#FFD700"
              strokeWidth="0.5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 4 18;360 4 18"
                dur="2s"
                repeatCount="indefinite"
                begin="1s"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.5s"
                repeatCount="indefinite"
                begin="1s"
              />
            </path>
          </g>
        </g>

        {/* Hiệu ứng sóng ngạc nhiên */}
        <circle
          cx="12"
          cy="12"
          r="12"
          fill="none"
          stroke="#FFD700"
          strokeWidth="0.5"
          opacity="0.6"
        >
          <animate
            attributeName="r"
            values="12;16;12"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0;0.6"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    ),
  },
  {
    type: "angry",
    color: "#f33e58",
    name: "Tức giận",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 rounded-full">
        <defs>
          {/* Gradient cho nền đỏ tức giận */}
          <radialGradient id="angryCircleGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="50%" stopColor="#F33E58" />
            <stop offset="100%" stopColor="#D32F2F" />
          </radialGradient>

          {/* Gradient cho khói tức giận */}
          <radialGradient id="smokeGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#666666" />
            <stop offset="50%" stopColor="#999999" />
            <stop offset="100%" stopColor="#CCCCCC" />
          </radialGradient>

          {/* Filter cho hiệu ứng rung */}
          <filter id="angryShake" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="2" dy="3" result="offset" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient cho lửa */}
          <radialGradient id="fireGradient" cx="50%" cy="70%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="30%" stopColor="#FF8F00" />
            <stop offset="70%" stopColor="#FF5722" />
            <stop offset="100%" stopColor="#D32F2F" />
          </radialGradient>
        </defs>

        {/* Shadow rung */}
        <ellipse
          cx="13"
          cy="15"
          rx="11"
          ry="9"
          fill="rgba(211, 47, 47, 0.4)"
          opacity="0.6"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.1s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Hình tròn nền tức giận */}
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="url(#angryCircleGradient)"
          filter="url(#angryShake)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,1;0,-1;0,0"
            dur="0.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill"
            values="url(#angryCircleGradient);#FF4444;url(#angryCircleGradient)"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Highlight */}
        <ellipse cx="9" cy="8" rx="3.5" ry="2.5" fill="#FFFFFF" opacity="0.3">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.2s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Lông mày tức giận - trái */}
        <path
          d="M6 7 Q8 5.5 10 7.5"
          stroke="#8B0000"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-width"
            values="2;2.5;2"
            dur="0.3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Lông mày tức giận - phải */}
        <path
          d="M14 7.5 Q16 5.5 18 7"
          stroke="#8B0000"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-width"
            values="2;2.5;2"
            dur="0.3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Mắt tức giận - trái */}
        <ellipse cx="8.5" cy="10" rx="1.5" ry="1.2" fill="#8B0000">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values="1.2;0.8;1.2"
            dur="0.4s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Mắt tức giận - phải */}
        <ellipse cx="15.5" cy="10" rx="1.5" ry="1.2" fill="#8B0000">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values="1.2;0.8;1.2"
            dur="0.4s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Miệng tức giận */}
        <path
          d="M8 15 Q12 18 16 15"
          stroke="#8B0000"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="d"
            values="M8 15 Q12 18 16 15;M8 15.5 Q12 18.5 16 15.5;M8 15 Q12 18 16 15"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Răng nanh */}
        <polygon points="10,16 11,18 12,16" fill="#FFFFFF">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.2s"
            repeatCount="indefinite"
          />
        </polygon>
        <polygon points="12,16 13,18 14,16" fill="#FFFFFF">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;1,0;-1,0;0,0"
            dur="0.2s"
            repeatCount="indefinite"
          />
        </polygon>

        {/* Khói tức giận */}
        <g opacity="0.7">
          {/* Khói trái */}
          <ellipse cx="6" cy="6" rx="1.5" ry="3" fill="url(#smokeGradient)">
            <animate
              attributeName="ry"
              values="3;5;3"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.7;0.3;0.7"
              dur="1s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;-2,-4;0,0"
              dur="2s"
              repeatCount="indefinite"
            />
          </ellipse>

          {/* Khói phải */}
          <ellipse cx="18" cy="6" rx="1.5" ry="3" fill="url(#smokeGradient)">
            <animate
              attributeName="ry"
              values="3;5;3"
              dur="1s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animate
              attributeName="opacity"
              values="0.7;0.3;0.7"
              dur="1s"
              repeatCount="indefinite"
              begin="0.5s"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;2,-4;0,0"
              dur="2s"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </ellipse>

          {/* Khói nhỏ */}
          <circle cx="4" cy="4" r="1" fill="url(#smokeGradient)">
            <animate
              attributeName="r"
              values="1;1.5;1"
              dur="0.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.1;0.5"
              dur="0.8s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;-1,-3;0,0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="20" cy="4" r="1" fill="url(#smokeGradient)">
            <animate
              attributeName="r"
              values="1;1.5;1"
              dur="0.8s"
              repeatCount="indefinite"
              begin="0.3s"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.1;0.5"
              dur="0.8s"
              repeatCount="indefinite"
              begin="0.3s"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;1,-3;0,0"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </circle>
        </g>

        {/* Hiệu ứng lửa nhỏ */}
        <g opacity="0.8">
          <ellipse cx="5" cy="12" rx="0.8" ry="2" fill="url(#fireGradient)">
            <animate
              attributeName="ry"
              values="2;3;2"
              dur="0.3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;0.4;0.8"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </ellipse>

          <ellipse cx="19" cy="12" rx="0.8" ry="2" fill="url(#fireGradient)">
            <animate
              attributeName="ry"
              values="2;3;2"
              dur="0.3s"
              repeatCount="indefinite"
              begin="0.1s"
            />
            <animate
              attributeName="opacity"
              values="0.8;0.4;0.8"
              dur="0.3s"
              repeatCount="indefinite"
              begin="0.1s"
            />
          </ellipse>
        </g>

        {/* Hiệu ứng sấm sét */}
        <g opacity="0.6">
          <path
            d="M2 16 L4 14 L3 14 L5 12 L3 12 L4 14"
            stroke="#FFD700"
            strokeWidth="1"
            fill="#FFD700"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="0.2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M22 16 L20 14 L21 14 L19 12 L21 12 L20 14"
            stroke="#FFD700"
            strokeWidth="1"
            fill="#FFD700"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="0.2s"
              repeatCount="indefinite"
              begin="0.1s"
            />
          </path>
        </g>
      </svg>
    ),
  },
];
