import IPDFList from "../models/PDFList.model";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PDFListItem: React.FC<IPDFList> = ({ title, name }: IPDFList) => {

  const router = useRouter();

  const view = () => {
    router.push("/view");
  }

  return (
    <>
      <div className="flex flex-col border-2 border-black overflow-hidden p-8 rounded-xl shadow-large bg-yellow-200 w-80 justify-center items-center">
        <div className="px-0 py-2">
          <div className="items-center w-full justify-center grid grid-cols-1 text-left">
            <div>
              <h2 className="text-black font-bold text-lg lg:text-3xl">{title}</h2>
              <p className="text-black tracking-tight xl:text-xl mt-5">
                {name}
              </p>
            </div>
          </div>
        </div>
        <Image src="/pdf.png" alt="PDF" width={120} height={20} className="p-4" />
        <div className="flex flex-col flex-1 justify-between pb-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={() => view()} className="text-black items-center inline-flex bg-white border-2 border-black duration-200 ease-in-out focus:outline-none hover:bg-black hover:shadow-none hover:text-white justify-center rounded-xl shadow-[5px_5px_black] text-center transform transition w-72 px-2 py-2">
              V I E W
            </button>
          </div>
        </div>
      </div>

    </>
  )
}

export default PDFListItem
