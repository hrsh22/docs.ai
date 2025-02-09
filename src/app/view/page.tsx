"use client"

import { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { searchPlugin } from "@react-pdf-viewer/search";
import { useAccount } from "wagmi";

export default function Dummy() {
    const [initialPage, setInitialPage] = useState(0);
    const [summary, setSummary] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const currentPage = localStorage.getItem("current-page");
        if (currentPage) {
            setInitialPage(parseInt(currentPage, 10));
        }
    }, []);

    const fileUrl2 = "/recources/Bill.pdf";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePageChange = (e: any) => {
        localStorage.setItem("current-page", `${e.currentPage}`);
    };

    const getSummary = async () => {
        try {
            setIsLoading(true);
            const pdfPath = fileUrl2.substring(1);
            console.log('Original PDF path:', pdfPath);

            // Create a URLSearchParams object for the request
            const params = new URLSearchParams();
            params.append('pdfPath', pdfPath);

            console.log('Attempting to summarize PDF:', pdfPath);
            console.log('Request URL:', '/api/aiagents/summarizer');

            const response = await fetch('/api/aiagents/summarizer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pdfPath: pdfPath
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (response.status === 404) {
                throw new Error('PDF file not found. Please check if the file exists in the correct location.');
            }

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${responseText}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                throw new Error('Invalid JSON response from server');
            }

            if (data.error) {
                console.error('API Error:', data.error);
                setSummary(`Error: ${data.error}`);
            } else {
                console.log('Summary received:', data.summary);
                setSummary(data.summary || 'No summary returned');
            }
        } catch (error) {
            console.error('Error in getSummary:', error);
            setSummary(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const getBill = async () => {
        try {
            setIsLoading(true);
            const pdfPath = fileUrl2.substring(1);
            console.log('Original PDF path:', pdfPath);

            // Create a URLSearchParams object for the request
            const params = new URLSearchParams();
            params.append('pdfPath', pdfPath);

            console.log('Attempting to trace Bill:', pdfPath);
            console.log('Request URL:', '/api/aiagents/caAgent');

            const response = await fetch('/api/aiagents/caAgent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pdfPath: pdfPath
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (response.status === 404) {
                throw new Error('PDF file not found. Please check if the file exists in the correct location.');
            }

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${responseText}`);
            }

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                throw new Error('Invalid JSON response from server');
            }

            if (data.error) {
                console.error('API Error:', data.error);
                setSummary(`Error: ${data.error}`);
            } else {
                console.log('Summary received:', data.summary);
                setSummary(data.summary || 'No summary returned');
            }
        } catch (error) {
            console.error('Error in getSummary:', error);
            setSummary(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const searchPluginInstance = searchPlugin();
    const pageNavigationPluginInstance = pageNavigationPlugin();

    const { address, isConnected } = useAccount();
    console.log("ADDRESS", address);
    console.log("IS CONNECTED", isConnected);

    return (
        <div className="flex flex-row bg-white">
            <div className="w-1/4 bg-slate-500">
                <div className="fixed">
                    <div className="flex flex-col gap-6 items-center justify-center p-5">
                        <div className="flex flex-col justify-center items-center bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80">
                            <h2 className="text-2xl font-bold mb-4 text-center">A I &nbsp;&nbsp;&nbsp;A G E N T S</h2>
                            <p className="mb-4 text-center">
                                TAKE AGENT HELP
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={getSummary}
                                    disabled={isLoading}
                                    className="text-blue-500 hover:text-blue-400 transition duration-200 disabled:opacity-50"
                                >
                                    {isLoading ? "Summarizing..." : "Summarize"}
                                </button>
                                <button 
                                onClick={getBill}
                                disabled={isLoading}
                                className="text-blue-400 hover:text-blue-300 transition duration-200">
                                    {isLoading ? "Generating..." : "Bill Agent"}
                                </button>
                                <button className="text-blue-400 hover:text-blue-300 transition duration-200">
                                    A3
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col justify-start items-start bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80 h-[460px] overflow-y-auto">
                            {summary && (
                                <>
                                    <h3 className="text-lg font-semibold mb-2">Document Summary</h3>
                                    <p className="text-sm">{summary}</p>
                                </>
                            )}
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