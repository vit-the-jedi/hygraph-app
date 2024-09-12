import InfoIcon from '@mui/icons-material/Info';
import AnnouncementIcon from '@mui/icons-material/Announcement';

export default function HelperInfo({errors}) {
  console.log(errors);
  const errorHelpers = new Map();
  errorHelpers.set('value is not unique for the field "urlSlug"', 'There is already an existing article with that title. Change the title of the article, or check to see if this article has already been uploaded.');
  errorHelpers.set('Field "ArticleCreateInput.someField" of required type "SomeType!" was not provided.', 'Your article is missing a required field. Ensure you have a Title, Meta Keywords, Excerpt, and Cover Image in the article and try again.');
  errorHelpers.set('The caller does not have permission', 'You must add googledocs@just-site-330115.iam.gserviceaccount.com as an editor on the article.');
  errorHelpers.set('Error transpiling document', 'The document is malformed. Ensure the document contains 1 article, with a title, meta keywords, excerpt, and cover image.');
  errorHelpers.set('Only alphanumeric characters and dashes (-) allowed, no spaces.', 'There was an issue generating a url slug, this can happen because the document is malformed.');
  errorHelpers.set('Expected value to have between 1 and 300 characters.', 'There was an issue locating an excerpt, this can happen because the document is malformed.');


  return (
    <aside className="bg-indigo-900 pt-3 pb-4 px-3 my-10 rounded-md border-l-4 border-indigo-500">
      <div className='flex'>
        <InfoIcon className="text-2xl text-indigo-500 relative top-1 mr-2" />
        <h2 className="text-2xl mb-1">Error Status Tips</h2>
      </div>
      <ul className='ml-7'>
      {errors.flat().map((item, index) => (
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