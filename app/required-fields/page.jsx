
import Header from '../components/common/Header.jsx';
import InfoIcon from '@mui/icons-material/Info';

export default async function RequiredFields({
}) {
  return (
    <main className="flex min-h-screen flex-col items-center p-10 justify-start font-sans bg-indigo-950">
      <Header />
      <section style={{maxWidth:'900px',width:'100%', margin:'auto'}}>
        <h1 className='text-4xl mb-10 text-center'>Required Fields</h1>
        <aside className="bg-violet-950 pt-3 pb-4 px-3 my-10 rounded-md border-l-4 border-indigo-500">
          <div className='flex'>
            <InfoIcon className="text-2xl text-indigo-500 relative top-1 mr-2" />
            <h2 className="text-2xl mb-1">Required Fields List</h2>
          </div>
          <div className='ml-7 pt-5'>
            <p>Fields marked in <span className="text-yellow-500">yellow</span> must be present in each document.</p>
            <p>Fields marked in white are generated internally.</p>
          </div>
        </aside>
        <ol style={{listStyleType:"number", maxWidth: '750px', width: '100%', margin:'auto'}}>
          <li className='text-yellow-500'>Title</li>
          <li>URL Slug</li>
          <li>Date</li>
          <li className='text-yellow-500'>Excerpt</li>
        </ol>
      </section>  
    </main>
  );
}
