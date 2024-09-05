import HygraphLogo from "../icons/HygraphLogo";
import GoogleDocsLogo from "../icons/GoogleDocsLogo";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

export default function Header() {
  const config = {
    logoSize: {h:60,w:60},
  }
  return (
    <header className="mb-10 ">
      <div className="flex justify-between w-60">
        <GoogleDocsLogo size={config.logoSize}/>
        <DoubleArrowIcon className="text-yellow-500 text-4xl relative top-2"/>
        <HygraphLogo size={config.logoSize}/>
        </div>
    </header>
  )
}