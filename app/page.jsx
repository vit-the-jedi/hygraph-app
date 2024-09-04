import DocLinkForm from './components/DocLinkForm.jsx';
import UploadCheckList from './components/UploadCheckList.jsx';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 font-sans bg-indigo-950">

      <h1 className='text-4xl text-center my-3'>Upload Articles to Hygraph with a Click!</h1>
      <p className='my-3'>Paste all of your Google Doc links below, and we will upload each one in the order provided.</p>

      <UploadCheckList />
      <DocLinkForm/>
    </main>
  );
}
