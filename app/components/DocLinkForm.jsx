"use client";
import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";
import PrimaryButton from "./buttons/PrimaryButton.jsx";
import SecondaryButton from "./buttons/SecondaryButton.jsx";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_INPUT":
      return {
        ...state,
        inputs: [...state.inputs, { id: state.inputs.length + 1, value: "" }],
      };
    case "REMOVE_INPUT":
      return {
        ...state,
        inputs: state.inputs.filter((input) => input.id !== action.payload),
      };
    case "UPDATE_SELECT":
      return { ...state, select: action.payload };
    case "UPDATE_INPUT":
      return {
        ...state,
        inputs: state.inputs.map((input) =>
          input.id === action.payload.id
            ? { ...input, value: action.payload.value }
            : input
        ),
      };
    case "NO_LINKS":
      return { ...state, error: "Please add at least one link" };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export default function DocLinkForm() {
  const initialState = {
    inputs: [{ id: 1, value: "" }],
    select: "findhomepros.com",
    loading: false,
  };
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const saveDocLinksAndRedirect = (e) => {
    e.preventDefault();
    const docLinks = Object.values(state.inputs)
      .map((input) => {
        if (
          input.value.length > 0 &&
          input.value &&
          input.value.includes("docs.google.com")
        ) {
          return input.value;
        }
      })
      .filter((link) => link);
    const query = new URLSearchParams({ docLinks, domain: state.select });

    if (docLinks.length === 0) {
      dispatch({ type: "NO_LINKS" });
      return;
    }
    router.push(`/upload?${query.toString()}`);
  };
  return (
    <form className="grid my-3">
      {state.error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
          onClick={() => dispatch({ type: "CLEAR_ERROR" })}
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}
      <div className="m-3">
        <select
          id="brand-picker"
          className="w-full border p-2 border-gray-300 text-gray-900 rounded-md"
          onChange={(e) =>
            dispatch({ type: "UPDATE_SELECT", payload: e.target.value })
          }
        >
          <option value="findhomepros.com">Find Home Pros</option>
          <option value="protect.com">Protect</option>
          <option value="free-insurance-quotes.us">
            Free Insurance Quotes
          </option>
          <option value="simplyjobs.com">Simply Jobs</option>
          <option value="searchmynewjob.com">Search My New Job</option>
        </select>
      </div>
      {state.inputs.map((input, i, arr) => (
        <div key={i} className="flex m-3 relative">
          <input
            key={i}
            type="text"
            placeholder="Paste Google Doc Link"
            value={input.value}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_INPUT",
                payload: { id: input.id, value: e.target.value },
              })
            }
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
                onClick={() =>
                  dispatch({ type: "REMOVE_INPUT", payload: input.id })
                }
                style={{ top: "2.5px" }}
              />
            </div>
          )}
        </div>
      ))}
      <div className="flex align-center justify-center">
        <SecondaryButton
          buttonConfig={{
            text: "Add Another Link",
            onClick: () => dispatch({ type: "ADD_INPUT" }),
          }}
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
