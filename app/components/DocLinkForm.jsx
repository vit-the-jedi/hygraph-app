"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "./buttons/PrimaryButton.jsx";
import SecondaryButton from "./buttons/SecondaryButton.jsx";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function DocLinkForm() {
  const [inputs, setInputs] = useState([{ id: 1, value: "" }]);
  const [select, updateSelect] = useState("findhomepros.com");
  const router = useRouter();

  const handleInputChange = (id, value) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) => (input.id === id ? { ...input, value } : input))
    );
  };
  const handleSelectChange = (id, value) => {
    updateSelect(() => value);
  };
  const addInput = () => {
    const newId =
      inputs.length > 0 ? Math.max(...inputs.map((input) => input.id)) + 1 : 1;
    setInputs((prevInputs) => [...prevInputs, { id: newId, value: "" }]);
  };
  const removeInput = (ev) => {
    const input = inputs.find((input) => input.id === Number(ev.target.id));
    console.log(input);
    inputs.splice(inputs.indexOf(input), 1);
    setInputs((prevInputs) => Array.from(inputs));
  };
  const saveDocLinksAndRedirect = (e) => {
    e.preventDefault();
    const docLinks = Object.values(inputs).map((input) => input.value);
    const query = new URLSearchParams({ docLinks, domain: select });
    router.push(`/upload?${query.toString()}`);
  };
  return (
    <form className="grid my-3">
      <div className="m-3">
        <select
          id="brand-picker"
          className="w-full border p-2 border-gray-300 text-gray-900 rounded-md"
          onChange={(e) => handleSelectChange(select.id, e.target.value)}
        >
          <option value="findhomepros.com">Find Home Pros</option>
          <option value="protect.com">Protect</option>
          <option value="free-insurance-quotes.us">
            Free Insurance Quotes
          </option>
          <option value="simplyjobs.com">Simply Jobs</option>
          <option value="searchmynewjob.com">Search My New Job</option>
          <option value="getthejob.com">Get The Job</option>
        </select>
      </div>
      {inputs.map((input, i, arr) => (
        <div key={i} className="flex m-3 relative">
          <input
            key={i}
            type="text"
            placeholder="Paste Google Doc Link"
            value={input.value}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            className="border flex-1 p-2 border-gray-300 text-zinc-900 rounded-md"
          />
          {/* <button className="rounded-full bg-blue-900 py-2 px-3 ml-3 absolute" style={{right:'-40px'}}key={input.id} id={input.id} type="button" onClick={removeInput}>
              X 
            </button> */}
          {input.id > 1 && (
            <div
              key={input.id}
              className="rounded-full bg-blue-900 p-1 ml-3 absolute cursor-pointer"
              style={{
                right: "-60px",
                width: "40px",
                height: "40px",
                textAlign: "center",
              }}
            >
              <RemoveCircleOutlineIcon
                className="text-white relative"
                id={input.id}
                onClick={removeInput}
                style={{ top: "2.5px" }}
              />
            </div>
          )}
        </div>
      ))}
      <div className="flex align-center justify-center">
        <SecondaryButton
          buttonConfig={{ text: "Add Another Link", onClick: addInput }}
        />
        <PrimaryButton
          buttonConfig={{
            text: "Start Upload",
            onClick: saveDocLinksAndRedirect,
          }}
        />
      </div>
    </form>
  );
}
