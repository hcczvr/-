import React from 'react';
import { WordItem } from '../types';

interface WordListProps {
  title: string;
  words: WordItem[];
  colorClass: string;
  icon: React.ReactNode;
}

const WordList: React.FC<WordListProps> = ({ title, words, colorClass, icon }) => {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full">
      <div className={`px-4 py-3 border-b border-slate-100 flex items-center gap-2 ${colorClass} bg-opacity-10`}>
        <div className={`p-1.5 rounded-lg ${colorClass} text-white`}>
          {icon}
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className="ml-auto text-xs font-medium bg-white px-2 py-0.5 rounded-full text-slate-500 border border-slate-200">
          {words.length} results
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-0 min-h-[200px]">
        {words.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm">No words found</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0">
              <tr>
                <th className="px-4 py-2 font-medium w-1/2">Word</th>
                <th className="px-4 py-2 font-medium w-1/2">IPA</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {words.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-slate-900">{item.word}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500 text-xs tracking-tight">{item.ipa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WordList;