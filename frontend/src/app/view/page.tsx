"use client"

import { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { searchPlugin } from "@react-pdf-viewer/search";
import { useAccount, useSendTransaction } from "wagmi";
import Image from "next/image";
import { parseEther } from "ethers";

export default function Dummy() {
    const [initialPage, setInitialPage] = useState(0);
    const [summary, setSummary] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [agentId, setAgentId] = useState(0);
    const [accAdd, setAccountAdd] = useState();
    const [amt, setAmt] = useState("");
    const [loading, setLoading] = useState(false);

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
            setAgentId(1);
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
            setAgentId(2);
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
            let ca;
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
                const firstParse = data.summary;

                // Step 2: Parse the inner JSON
                const finalJson = JSON.parse(firstParse);

                console.log(finalJson);

                setSummary(finalJson.displayMessage || 'No summary returned');
                // Clean up the address by removing any spaces
                const cleanAddress = finalJson.accountAddress.replace(/\s+/g, '');
                setAccountAdd(cleanAddress);
                setAmt(finalJson.finalAmount);
            }
        } catch (error) {
            console.error('Error in getSummary:', error);
            setSummary(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const { sendTransactionAsync } = useSendTransaction();

    const payInvoice = async () => {
        try {
            setLoading(true);
            if (!isConnected) {
                throw new Error('Please connect your wallet first');
            }

            if (!accAdd || !/^0x[a-fA-F0-9]{40}$/.test(accAdd)) {
                throw new Error('Invalid Ethereum address');
            }

            // Ensure amount is a valid string and handle potential formatting
            const formattedAmount = amt.toString().trim();
            if (!formattedAmount) {
                throw new Error('Invalid amount');
            }

            const txResponse = await sendTransactionAsync({
                to: accAdd as `0x${string}`,
                value: parseEther(formattedAmount),
            });

            alert('Transaction submitted! Transaction hash: ' + txResponse);
            alert('Transaction successful!');
        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed. Please check the console for more details.');
        } finally {
            setLoading(false);
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
                            <h2 className="text-2xl mb-4 text-center">A I &nbsp;&nbsp;&nbsp;A G E N T S</h2>

                            <div className="flex flex-row gap-8">
                                {isLoading ? <>

                                    <div className="flex-col gap-4 w-full flex items-center justify-center">
                                        <div
                                            className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                                        >
                                            <div
                                                className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                                            ></div>
                                        </div>
                                    </div>
                                </> : <>
                                    <button
                                        onClick={getSummary}
                                        className="cursor-pointer relative after:content-['Summarize'] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-200 w-16 h-16 rounded-full border border-4 border-sky-200 bg-black pointer flex items-center justify-center duration-300 hover:rounded-[50px] hover:w-36 group/button overflow-hidden active:scale-90"
                                    >
                                        <Image className="fill-white delay-50 duration-200 group-hover/button:-translate-y-12" src="/shine.png" alt="" width={40} height={20} />
                                    </button>
                                    <button
                                        onClick={getBill}
                                        className="cursor-pointer relative after:content-['Invoice'] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-200 w-16 h-16 rounded-full border border-4 border-sky-200 bg-black pointer flex items-center justify-center duration-300 hover:rounded-[50px] hover:w-36 group/button overflow-hidden active:scale-90"
                                    >
                                        <Image className="fill-white delay-50 duration-200 group-hover/button:-translate-y-12" src="/money.png" alt="" width={40} height={20} />
                                    </button>
                                </>}

                            </div>
                        </div>

                        <div className="flex flex-col justify-start items-center bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80 h-[460px] overflow-y-auto">
                            {summary && (
                                <>
                                    {agentId == 1 ? <>
                                        <h3 className="text-lg font-semibold mb-2 text-center"> AI AGENT RESPONSE</h3>
                                        <p className="text-sm">{summary}</p>
                                    </> : <>
                                        <h3 className="text-lg font-semibold mb-2 text-center"> AI AGENT RESPONSE</h3>
                                        <p className="text-sm">{summary}</p>
                                        {agentId === 2 && (
                                            <div className="absolute bottom-12 inline-flex items-center justify-center gap-4 group">
                                                <div
                                                    className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"
                                                ></div>
                                                <button
                                                    role="button"
                                                    className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
                                                    title="payment"
                                                    onClick={payInvoice}
                                                >Pay Invoice<svg
                                                    aria-hidden="true"
                                                    viewBox="0 0 10 10"
                                                    height="10"
                                                    width="10"
                                                    fill="none"
                                                    className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                                                >
                                                        <path
                                                            d="M0 5h7"
                                                            className="transition opacity-0 group-hover:opacity-100"
                                                        ></path>
                                                        <path
                                                            d="M1 1l4 4-4 4"
                                                            className="transition group-hover:translate-x-[3px]"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </>}
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