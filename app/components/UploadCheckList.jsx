import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';

export default function UploadCheckList() {
  return (
    <aside className="bg-indigo-900 pt-3 pb-4 px-3 my-10 rounded-md border-l-4 border-indigo-500">
      <div className='flex'>
        <InfoIcon className="text-2xl text-indigo-500 relative top-1 mr-2" />
        <h2 className="text-2xl mb-1">Checklist</h2>
      </div>
      <ul className='ml-3'>
        <div className='flex'>
          <CheckIcon className="text-indigo-500 relative top-2 mr-2 text-lg" />
          <li className='my-1'>Include each Docs url you want to upload.</li>
        </div>
        <div className='flex'>
          <CheckIcon className="text-indigo-500 relative top-2 mr-2 text-lg" />
          <li className='my-1'>Allow <span className="text-yellow-500 bold whitespace-nowrap">googledocs@just-site-330115.iam.gserviceaccount.com</span> as an editor on each doc.</li>
        </div>
        <div className='flex'>
          <CheckIcon className="text-indigo-500 relative top-2 mr-2 text-lg" />
          <li className='my-1'>Have values for all <a className="underline text-yellow-500" href="/required-fields" target='_blank'>required fields</a> in your documents.</li>
        </div>
        <div className='flex'>
          <CheckIcon className="text-indigo-500 relative top-2 mr-2 text-lg" />
          <li className='my-1'>Each document contains <span className="text-yellow-500 bold">only one article.</span></li>
        </div>
      </ul>
    </aside>
  );
}