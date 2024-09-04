export default function PrimaryButton({buttonConfig}){
    return (
        <div>
            <button type="button" className="m-5 bg-yellow-500 rounded-md p-3" onClick={buttonConfig.onClick}>
                {buttonConfig.text}
            </button>
        </div>
    )
}