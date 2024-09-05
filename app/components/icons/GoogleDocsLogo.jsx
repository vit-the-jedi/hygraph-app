export default function GoogleDocsLogo(size){
  const {size : {h}, size : {w}} = size; 
  const styles = `
      .cls-1 {
        fill: rgba(255, 255, 255, .2);
      }

      .cls-1, .cls-2, .cls-3, .cls-4, .cls-5, .cls-6, .cls-7 {
        stroke-width: 0px;
      }

      .cls-1, .cls-3, .cls-4, .cls-5, .cls-6, .cls-7 {
        fill-rule: evenodd;
      }

      .cls-2 {
        fill: url(#linear-gradient);
      }

      .cls-3 {
        fill: #a1c2fa;
      }

      .cls-4 {
        fill: #f1f1f1;
      }

      .cls-5 {
        fill: #4285f4;
      }

      .cls-6 {
        fill: url(#radial-gradient);
        fill-opacity: .1;
      }

      .cls-7 {
        fill: rgba(26, 35, 126, .2);
      }
`;
  return (
    <svg style={{width:`${w}px`, height: `${h}px`}} width={w} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 75">
   <style>{styles}</style>
    <defs>
      <linearGradient id="linear-gradient" x1="-884.55" y1="652.3" x2="-884.55" y2="650.4" gradientTransform="translate(7560.5 5562.75) scale(8.5 -8.5)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#1a237e" stopOpacity=".2"/>
        <stop offset="1" stopColor="#1a237e" stopOpacity=".02"/>
      </linearGradient>
      <radialGradient id="radial-gradient" cx="-208.85" cy="623.78" fx="-208.85" fy="623.78" r="1.61" gradientTransform="translate(10444.23 33790.08) scale(50 -54.17)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff"/>
        <stop offset="1" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <g>
        <path class="cls-5" d="M4.81,0h27.88l17.31,18.75v51.04c0,2.88-2.15,5.21-4.81,5.21H4.81c-2.66,0-4.81-2.33-4.81-5.21V5.21C0,2.33,2.15,0,4.81,0Z"/>
        <path class="cls-7" d="M0,68.75c0,2.88,2.15,5.21,4.81,5.21h40.38c2.66,0,4.81-2.33,4.81-5.21v1.04c0,2.88-2.15,5.21-4.81,5.21H4.81c-2.66,0-4.81-2.33-4.81-5.21v-1.04Z"/>
        <path class="cls-1" d="M4.81,0h27.88v1.04H4.81C2.15,1.04,0,3.37,0,6.25v-1.04C0,2.33,2.15,0,4.81,0Z"/>
        <path class="cls-2" d="M33.65,16.67l16.35,17.71v-15.62"/>
        <path class="cls-3" d="M32.69,0l17.31,18.75h-12.5c-2.66,0-4.81-2.33-4.81-5.21V0Z"/>
        <path class="cls-4" d="M11.54,33.33h26.92v4.17H11.54v-4.17ZM11.54,41.67h26.92v4.17H11.54v-4.17ZM11.54,50h26.92v4.17H11.54v-4.17ZM11.54,58.33h19.23v4.17H11.54v-4.17Z"/>
        <path class="cls-6" d="M4.81,0h27.88l17.31,18.75v51.04c0,2.88-2.15,5.21-4.81,5.21H4.81c-2.66,0-4.81-2.33-4.81-5.21V5.21C0,2.33,2.15,0,4.81,0Z"/>
      </g>
    </g>
  </svg>
      )
}