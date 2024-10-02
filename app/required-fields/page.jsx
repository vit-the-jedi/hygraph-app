
import Header from '../components/common/Header.jsx';
import InfoIcon from '@mui/icons-material/Info';

export default async function RequiredFields({
}) {
  return (
    <main className="flex min-h-screen flex-col items-center p-10 justify-start font-sans bg-indigo-950">
      <Header />
      <section style={{maxWidth:'900px',width:'100%', margin:'auto'}}>
        <h1 className='text-4xl mb-10 text-center'>Required Fields</h1>
        <aside className="bg-indigo-900 pt-3 pb-4 px-3 my-10 rounded-md border-l-4 border-indigo-500">
          <div className='flex'>
            <InfoIcon className="text-2xl text-indigo-500 relative top-1 mr-2" />
            <h2 className="text-2xl mb-1">Required Fields List</h2>
          </div>
          <div className='ml-7 pt-5'>
            <p>Fields marked in <span className="text-yellow-500">yellow</span> must be present in each document. If these fields are not prsent, upload to Hygraph will fail.</p>
            <p>Fields marked in <span className="text-pink-500">pink</span> are not necessary for upload, but are needed in order to show releveant articles on our sites.</p>
            <p>Fields marked in white are generated internally and should not be present in the document.</p>
          </div>
        </aside>
        <ol style={{listStyleType:"number", maxWidth: '750px', width: '100%', margin:'auto'}}>
          <li className='text-yellow-500'>Title</li>
          <li className='text-yellow-500'>Excerpt</li>
          <li className='text-pink-500'>
            <div>
              <h3>Article Type</h3>
              <p className='text-pink-500'>Options: (all lowercase)</p>
              <ol style={{listStyleType:"disc",marginLeft: '20px'}}>
                <li className='text-pink-500'>article</li>
                <li className='text-pink-500'>guide</li>
                <li className='text-pink-500'>review</li>
                <li className='text-pink-500'>blog</li>
              </ol>
              
            </div>
          </li>
          <li className='text-pink-500'>
            <div>
              <h3>Vertical</h3>
              <p className='text-pink-500'>Protect Options: (all lowercase)</p>
              <ul style={{listStyleType:"disc",marginLeft: '20px'}}>
              <li className='text-pink-500'>insurance</li>
                <li className='text-pink-500'>home-security</li>
                <li className='text-pink-500'>warranty</li>
                <li className='text-pink-500'>identity</li>
              </ul>
              <p className='text-pink-500 mt-5'>Find Home Pros Options: (all lowercase)</p>
              <ul className='mb-5' style={{listStyleType:"disc",marginLeft: '20px'}}>
                <li className='text-pink-500'>home-services</li>
              </ul>
            </div>
          </li>
          <li className='text-pink-500'>
              <div>
                <h3>Subvertical</h3>
                <p className='text-pink-500'>Protect Options: (all lowercase)</p>
                <ul style={{listStyleType:"disc",marginLeft: '20px'}}>
                <li className='text-pink-500'>auto-insurance</li>
                  <li className='text-pink-500'>home-insurance</li>
                  <li className='text-pink-500'>health-insurance</li>
                </ul>
                <p className='text-pink-500 mt-5'>Find Home Pros Options: (all lowercase)</p>
                <ul className='mb-5' style={{listStyleType:"disc",marginLeft: '20px'}}>
                  <li className='text-pink-500'>bathroom</li>
                  <li className='text-pink-500'>flooring</li>
                  <li className='text-pink-500'>gutter</li>
                  <li className='text-pink-500'>hvac</li>
                  <li className='text-pink-500'>kitchen</li>
                  <li className='text-pink-500'>plumbing</li>
                  <li className='text-pink-500'>roofing</li>
                  <li className='text-pink-500'>siding</li>
                  <li className='text-pink-500'>solar</li>
                  <li className='text-pink-500'>walk-in-tubs</li>
                  <li className='text-pink-500'>windows</li>
                </ul>
              </div>
            </li>
          <li>URL Slug</li>
          <li>Date</li>
        </ol>
      </section>  
    </main>
  );
}
