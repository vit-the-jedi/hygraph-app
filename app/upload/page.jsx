import Header from '../components/common/Header.jsx';
import UploadDocs from '../components/UploadDocs.jsx';

export default async function Upload({
  params,
  searchParams,
}) {
  const info = [];
  let linkValues;
  if(searchParams.docLinks){
    linkValues = searchParams.docLinks.split(',');

    linkValues.forEach((link) => {
      info.push({[link]: {
        status: 'complete',
        result: null,
      }});
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10 justify-start font-sans bg-indigo-950">
      <Header />
      <section style={{maxWidth:'900px',width:'100%', margin:'auto'}}>
      <h1 className='text-4xl mb-10 text-center'>Review Your Uploads Below</h1>
      <p className='text-center'>Upload can take up to 1 minute.</p>
        <UploadDocs config={{
          baseURL: process.env.URL,
          links: linkValues,
          domain: searchParams.domain,
        }}/>
      </section>
    </main>
  );
}
