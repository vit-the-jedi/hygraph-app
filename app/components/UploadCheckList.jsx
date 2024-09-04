export default function UploadCheckList() {
  return (
    <aside className="bg-violet-950 pt-3 pb-4 px-3 my-10 rounded-md border-l-4 border-indigo-500">
      <h2 className="text-2xl mb-1">Checklist</h2>
      <ul>
        <li>Include each Docs url you want to upload.</li>
        <li>Allow <span className="text-yellow-500 whitespace-nowrap">googledocs@just-site-330115.iam.gserviceaccount.com</span> as an editor on each doc.</li>
        <li>Have values for all required fields in your documents.</li>
      </ul>
    </aside>
  );
}