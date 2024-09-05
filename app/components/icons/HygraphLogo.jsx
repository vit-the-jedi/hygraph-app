

export default function HygraphLogo(size){
  const {size : {h}, size : {w}} = size;
  return (
      <div className="rounded-md bg-white pt-1" style={{width:`${w}px`, height: `${h + 5}px`}}>
        <svg width={w} style={{width:`${w - 5}px`, height: `${h - 5}px`}}id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          viewBox="0 0 96 150" >
        <path className="st0" fill="" d="M74.5,20L57.1,30L39.6,40L22.1,50v20v10v10v10v10l17.5-10l17.5-10V80V70L39.6,80V60l17.5-10l17.5-10v10v10v10
          v10v10v10l-17.5,10l-17.5,10l-17.5,10L4.7,140l17.5,10l17.5-10l17.5-10l17.5-10L92,110V90V70V50v-7.7V30V10L74.5,0V20z"/>
        </svg>
      </div>
      )
}