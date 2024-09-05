import Header from './components/common/Header.jsx';
import DocLinkForm from './components/DocLinkForm.jsx';
import UploadCheckList from './components/UploadCheckList.jsx';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10 font-sans bg-indigo-950">
      <Header/>
      <section style={{maxWidth:'900px',width:'100%', margin:'auto'}}>
        <h1 className='text-4xl text-center my-3'>Upload Articles to Hygraph with a Click!</h1>
        <p className='my-3 text-center'>Paste all of your Google Doc links below, and we will upload each one in the order provided.</p>
  
        <UploadCheckList />
        <DocLinkForm/>
      </section>
    </main>
  );
}
