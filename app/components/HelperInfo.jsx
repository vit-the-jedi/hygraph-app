import InfoIcon from '@mui/icons-material/Info';
import AnnouncementIcon from '@mui/icons-material/Announcement';

export default function HelperInfo({errors}) {
  const errorHelpers = new Map();
  errorHelpers.set('value is not unique for the field "urlSlug"', 'There is already an existing article with that title. Change the title of the article and try again.');
  errorHelpers.set('Field "ArticleCreateInput.someField" of required type "SomeType!" was not provided.', 'Your article is missing a required field. Ensure you have a Title, Meta Keywords, Excerpt, and Cover Image in the article and try again.');
  return (
    <aside className="bg-violet-950 pt-3 pb-4 px-3 my-10 rounded-md border-l-4 border-indigo-500">
      <div className='flex'>
        <InfoIcon className="text-2xl text-indigo-500 relative top-1 mr-2" />
        <h2 className="text-2xl mb-1">Error Status Tips</h2>
      </div>
      <ul className='ml-7'>
      {errors.map((item, index) => (
        <li key={index}>
          <div className="my-3">
            <div className='flex'>
              <AnnouncementIcon className="text-red-500 relative top-1 mr-2 text-lg" />
              <p className="text-red-500 pb-2">{item}</p>
              </div>
            <p className='ml-1'>{errorHelpers.get(item)}</p>
          </div>        
        </li> 
      ))}
      </ul>
    </aside>
  );
}