"use client"
import React from "react";
import Header from "./header";
import { useRouter } from "next/navigation";

interface HeroProps {
    appType: string;
    tagLine: string;
    description: string;
    mainActionText: string;
}

const Hero: React.FC<HeroProps> = ({ appType, tagLine, description, mainActionText }) => {

    const router = useRouter();

    const view = () => {
        router.push("/view");
    }


    return (
        <div id="product bg-black">

            <div
                style={{ textShadow: "0px 1px 1px gray" }}
                className="flex flex-col items-center justify-start font-sans min-h-96 bg-gray-50 lg:pt-10 lg:pb-20 lg:bg-hero lg:bg-cover"
            >
                <Header />
                <div>
                    <p className="p-3 pt-12 text-lg font-bold text-gray-500 lg:text-gray-300">{appType}</p>
                </div>
                <div>
                    <p className="p-2 text-4xl font-bold text-center text-blue-800 lg:mx-auto lg:w-4/6 lg:text-5xl lg:text-gray-100">
                        {tagLine}
                    </p>
                </div>
                <div>
                    <p className="p-4 pt-6 font-sans text-2xl leading-10 text-center text-gray-500 lg:text-gray-200">
                        {description}
                    </p>
                </div>
                <div className="relative z-50 flex flex-col items-center justify-between h-48 lg:space-x-8 pt-7 lg:pt-0 lg:flex-row lg:justify-between lg:w-90">
                    <button onClick={() => view()} className="-mt-24 pt-3 pb-3 pl-12 pr-12 text-2xl font-semibold text-center text-white transition-all bg-orange-600 rounded-full shadow-2xl lg:ml-5 hover:bg-orange-700 focus:outline-none ring-4 ring-orange-600 lg:ring-2 lg:font-medium">
                        {mainActionText}
                    </button>

                </div>
            </div>
            <div className="z-0 flex flex-row items-start justify-center w-screen h-screen pt-20  bg-gray-50 lg:bg-white lg:w-full lg:h-96 lg:pt-0">
                <img className="absolute left-0 lg:left-auto lg:-mt-64 w-[500px] rounded-full" src={"/top.gif"} alt="Decorative" />
            </div>
        </div>
    );
};

export default Hero;
