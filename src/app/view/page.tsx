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
        <div className="flex flex-row">
            <div className="w-1/4 bg-slate-500">
                <div className="fixed">
AI AGENTS
                </div>
            </div>
            <div className="w-3/4 ">
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