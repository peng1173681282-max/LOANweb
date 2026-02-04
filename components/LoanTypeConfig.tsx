
import React from 'react';
import { LoanType } from '../types';

// 定义符合业务要求的贷款类型，并包含生成的编码
const mockTypes = [
  { id: 't1', title: '现金分期', code: 'LP001', description: '直接放款至用户银行卡，按期还本付息', category: 'Personal' },
  { id: 't2', title: '消费分期', code: 'LP002', description: '基于特定消费场景的受托支付贷款', category: 'Personal' },
  { id: 't3', title: '随借随还取现', code: 'LP003', description: '额度内自主支用，按日计息，随时归还', category: 'Business' },
  { id: 't4', title: '随借随还消费', code: 'LP004', description: '通过支付渠道进行额度消费，支持即时结清', category: 'Business' },
];

const LoanTypeConfig: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">贷款类型配置</h2>
          <p className="text-slate-500 text-sm">管理系统基础贷款分类、业务编码与逻辑定义</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all active:scale-95">
          新增贷款类型
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {mockTypes.map((type) => (
          <div key={type.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">ID: {type.id}</span>
            </div>
            
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mr-4 text-blue-600 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-lg font-bold text-slate-800">{type.title}</h4>
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">{type.code}</span>
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider rounded-md mt-1 inline-block ${
                  type.category === 'Personal' ? 'text-blue-500' : 'text-purple-500'
                }`}>
                  {type.category === 'Personal' ? '个人信贷' : '普惠金融'}
                </span>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-6 h-10 line-clamp-2">
              {type.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>关联 0 个产品配置</span>
              </div>
              <button className="text-blue-600 font-bold hover:underline">编辑逻辑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanTypeConfig;
