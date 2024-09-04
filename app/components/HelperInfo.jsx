export default function HelperInfo() {
  return (
    <aside className="bg-violet-950 pt-3 pb-4 px-3 my-10 rounded-md border-l-4 border-indigo-500">
      <h2 className="text-2xl mb-1">Error Status Tips</h2>
      <ul>
        <li>
          <div className="my-3">
            <p className="text-red-500 pb-2">'value is not unique for the field "urlSlug"'</p>
            <p>There is already an existing article with that title. Change the title of the article and try again.</p>
          </div>
          <div className="my-3">
            <p className="text-red-500 pb-2">'Field \"ArticleCreateInput.someField\" of required type \"SomeType!\" was not provided.'</p>
            <p>Your article is missing a required field. Ensure you have a Title, Meta Keywords, Excerpt, and Cover Image in the article and try again.</p>
          </div>
        </li>
      </ul>
    </aside>
  );
}