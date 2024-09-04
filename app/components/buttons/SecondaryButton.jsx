export default function SecondaryButton({buttonConfig}){
    return (
        <div>
            <button type="button" className="m-5 bg-indigo-500 rounded-md p-3" onClick={buttonConfig.onClick}>
              {buttonConfig.text}
            </button>
        </div>
    )
}