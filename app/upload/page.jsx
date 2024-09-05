
import {sendArticle} from '../api/send-article.js';
import LinkStatusDashboard from '../components/LinkStatusDashboard.jsx';
import HelperInfo from '../components/HelperInfo.jsx';
import Header from '../components/common/Header.jsx';

export default async function Upload({
  params,
  searchParams,
}) {
  const info = [];
  let hasError = false;
  if(searchParams.docLinks){
    const linkValues = searchParams.docLinks.split(',');

    linkValues.forEach((link) => {
      info.push({[link]: {
        status: 'complete',
        result: null,
      }});
    });
  
    let i = 0;
    for (const link of linkValues) {
      const result = await sendArticle(link);
      if (result?.errors?.length > 0){
        info[i][link].status = 'error';
        result.errors.forEach((error) => {
          info[i][link].message = error.message;
        }); 
        hasError = true;
      } else {
        info[i][link].status = 'complete';
        info[i][link].result = result.data.createArticle.id;
      }
      i++;
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 font-sans bg-indigo-950">
      <Header />
      <h1 className='text-4xl mb-10'>Review your uploads below</h1>
      <LinkStatusDashboard articleStatusInfo={info}/>
      {hasError && <HelperInfo/>}
    </main>
  );
}
