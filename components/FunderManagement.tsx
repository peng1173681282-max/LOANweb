
import React from 'react';
import { Funder } from '../types';

const mockFunders: Funder[] = [
  { id: 'f1', name: '工商银行', totalLimit: 50000000, usedLimit: 12000000, status: 'Active', type: 'Bank' },
  { id: 'f2', name: '外贸信托', totalLimit: 20000000, usedLimit: 15000000, status: 'Active', type: 'Trust' },
  { id: 'f3', name: '中关村银行', totalLimit: 10000000, usedLimit: 0, status: 'Paused', type: 'Bank' },
];

const FunderManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">资方管理</h2>
          <p className="text-slate-500 text-sm">配置和监控资金方的授信额度及合作状态</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all">
          新增资方
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFunders.map((funder) => (
          <div key={funder.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3 font-bold text-slate-600">
                  {funder.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{funder.name}</h4>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">{funder.type}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                funder.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {funder.status === 'Active' ? '合作中' : '已暂停'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">授信使用情况</span>
                  <span className="text-slate-700 font-semibold">{Math.round((funder.usedLimit/funder.totalLimit)*100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500" 
                    style={{ width: `${(funder.usedLimit/funder.totalLimit)*100}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                <div>
                  <p className="text-[10px] text-slate-400">总额度 (元)</p>
                  <p className="text-sm font-bold text-slate-800">{(funder.totalLimit/10000).toFixed(0)}万</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">余额 (元)</p>
                  <p className="text-sm font-bold text-slate-800">{((funder.totalLimit - funder.usedLimit)/10000).toFixed(0)}万</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <button className="flex-1 py-2 text-xs font-medium bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">额度调整</button>
              <button className="flex-1 py-2 text-xs font-medium bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">配置协议</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunderManagement;
