import React from "react";

import Hero from "./components/Hero";
import Step from "./components/Step";
import BottomLead from "./components/BottomLead";

type StepData = {
  title: string;
  heading: string;
  description: string;
  img: string;
  alternate: boolean;
};

type HeroData = {
  appType: string;
  tagLine: string;
  description: string;
  mainActionText: string;
};

const data: {
  hero: HeroData;
  step1: StepData;
  step2: StepData;
  step3: StepData;
} = {
  hero: {
    appType: "",
    tagLine: "The Future of Intelligent Document Management",
    description: "AI-Powered Document Processing & Smart Contract Execution",
    mainActionText: "Try Demo",
  },
  step1: {
    title: "Document Understanding Powered By AI",
    heading: "",
    description: "Instantly summarize, translate, and extract key insights from documents.",
    img: "/aidoc.png",
    alternate: false,
  },
  step2: {
    title: "AI Driven Compliance & Review",
    heading: "",
    description: "Get real-time insights for legal, tax, and financial documents with intelligent AI agents.",
    img: "/tax.png",
    alternate: true,
  },
  step3: {
    title: "Smart Contract-Integrated Payments",
    heading: "",
    description: "Automate transactions upon document approval without intermediaries.",
    img: "/contract.png",
    alternate: false,
  }
};

const App: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="flex flex-col">
        <Hero {...data.hero} />
        <div id="faq" className="pt-20 mb-20 px-72 text-3xl text-center text-gray-500">
          Docs.AI revolutionizes how you read, sign, and process contracts with AI-driven agents and blockchain-powered automation
        </div>

        <Step {...data.step1} />
        <Step {...data.step2} />
        <Step {...data.step3} />

        <BottomLead />
      </div>
    </div>
  );
};

export default App;
