"use client";
import {useRouter} from "next/navigation";
import { useState } from "react";

export default function DocLinkForm() {
  const [inputs, setInputs] = useState([{ id: 1, value: '' }]);
  const router = useRouter();

  const handleInputChange = (id, value) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) => (input.id === id ? { ...input, value } : input))
    );
  };
  const addInput = () => {
    const newId = inputs.length > 0 ? Math.max(...inputs.map((input) => input.id)) + 1 : 1;
    setInputs((prevInputs) => [...prevInputs, { id: newId, value: '' }]);
  };
  const saveDocLinksAndRedirect = (e) => {
    e.preventDefault();
    const docLinks = Object.values(inputs).map(input => input.value);
    const query = new URLSearchParams({ docLinks });
    router.push(`/upload?${query.toString()}`);
  }
  return (
    <form className="grid my-3">
      {inputs.map((input) => (
        <input
          key={input.id}
          type="text"
          placeholder="Paste Google Doc Link"
          value={input.value}
          onChange={(e) => handleInputChange(input.id, e.target.value)}
          className="border border-gray-300 p-2 text-zinc-900 my-3 rounded-md"
        />
      ))}
      <div className="flex">
        <button type="button" className="m-5 bg-indigo-500 rounded-md p-3" onClick={addInput}>
          Add Another Link
          </button>
        <button type="button" className="m-5 bg-yellow-500 rounded-md p-3" onClick={saveDocLinksAndRedirect}>
          Start Upload
        </button>
      </div>
    </form>
  );
}