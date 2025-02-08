"use client"

import Image from "next/image";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { searchPlugin } from "@react-pdf-viewer/search";

export default function Dummy() {

    const fileUrl2 = "/recources/Angular_Router_Crash_Course.pdf";
    const currentPage = localStorage.getItem("current-page");
    const initialPage = currentPage ? parseInt(currentPage, 10) : 0;
    const handlePageChange = (e: any) => {
        localStorage.setItem("current-page", `${e.currentPage}`);
    };

    const searchPluginInstance = searchPlugin();
    const pageNavigationPluginInstance = pageNavigationPlugin();

    return (
        <div className="flex flex-row bg-white">
            <div className="w-1/4 bg-slate-500">
                <div className="fixed ">

                    <div className="flex flex-col gap-6 items-center justify-center p-5">
                        <div
                            className="flex flex-col justify-center items-center bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-center">A I &nbsp;&nbsp;&nbsp;A G E N T S</h2>
                            <p className="mb-4 text-center">
                                TAKE AGENT HELP
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    className="text-blue-500 hover:text-blue-400 transition duration-200"
                                    
                                >
                                    A1
                                </button>
                                <button
                                    className="text-blue-400 hover:text-blue-300 transition duration-200"
                                    
                                >
                                    A2
                                </button>
                                <button
                                    className="text-blue-400 hover:text-blue-300 transition duration-200"
                                    
                                >
                                    A3
                                </button>
                            </div>

                        </div>

                        <div
                            className="flex flex-col justify-center items-center bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80 h-[460px]"
                        >

                        </div>
                    </div>

                </div>
            </div>
            <div className="w-3/4 mt-8 bg-white">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <div className="rpv-core__viewer viewer-wrapper">
                        <Viewer
                            fileUrl={`${fileUrl2}`}
                            initialPage={initialPage}
                            onPageChange={handlePageChange}
                            plugins={[searchPluginInstance, pageNavigationPluginInstance]}
                            defaultScale={1.5}
                        />
                    </div>
                </Worker>
            </div>
        </div>
    )

}