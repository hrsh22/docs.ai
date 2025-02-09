"use client"
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
    <div className="bg-white min-h-screen">
      <div className="flex flex-col justify-center items-center bg-white pt-8">
        <PDFList lists={data} />
      </div>
    </div>
  );
}
