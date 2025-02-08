"use client"
import Image from "next/image";

import { useEffect } from 'react';
import PDFList from './components/PDFList';
import { Data } from './data/PDFListData';
import IPDFList from './models/PDFList.model';

export default function Home() {
  const data: IPDFList[] = Data;
  useEffect(() => {
    document.onkeydown = function (e) {
      if (e.ctrlKey || e.altKey) {
        return false;
      }
    };

    window.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false);
  }, [])

  return (

    <div className="bg-white">
      <div className="flex flex-col justify-center items-center bg-white">
        <h1 className="">PDF Reader with Searching and Navigating</h1>
        <PDFList lists={data} />
      </div>
    </div>


  );
}
