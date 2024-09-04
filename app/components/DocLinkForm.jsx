"use client";
import {useRouter} from "next/navigation";
import { useState } from "react";
import PrimaryButton from "./buttons/PrimaryButton.jsx";
import SecondaryButton from "./buttons/SecondaryButton.jsx";

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
  const removeInput = (ev) => {
    const input = inputs.find(input => input.id === Number(ev.target.id));
    console.log(input);
    inputs.splice(inputs.indexOf(input),1);
    setInputs((prevInputs) => Array.from(inputs));
    console.log(inputs);
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
          <div className="flex m-3 relative">
          <input
            key={input.id}
            type="text"
            placeholder="Paste Google Doc Link"
            value={input.value}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            className="border flex-1 p-2 border-gray-300 text-zinc-900 rounded-md"
          />
          {input.id > 1 && <button className="rounded-full bg-blue-900 py-2 px-3 ml-3 absolute" style={{right:'-40px'}}key={input.id} id={input.id} type="button" onClick={removeInput}>
              X 
            </button>
          }
          </div>
        ))}
      <div className="flex">
        <SecondaryButton buttonConfig={{text:"Add Another Link", onClick: addInput}}/>    
        <PrimaryButton buttonConfig={{text:"Start Upload", onClick: saveDocLinksAndRedirect}}/>
      </div>
    </form>
  );
}