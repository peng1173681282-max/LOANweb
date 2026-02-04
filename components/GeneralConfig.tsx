
import React from 'react';

const GeneralConfig: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">通用配置</h2>
        <p className="text-slate-500 text-sm">管理系统全局参数、审批流与费率模板</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
        {[
          { title: '基准利率设置', desc: '设定 LPR 基准利率及浮动空间', status: 'Active' },
          { title: '风险等级模型', desc: '配置 A/B/C 级客户准入门槛', status: 'Active' },
          { title: '费用项模板', desc: '定义评估费、管理费等非利息收入', status: 'Inactive' },
          { title: '还款宽限期', desc: '全局逾期宽限天数配置', status: 'Active' },
          { title: '电子签章集成', desc: '第三方 CA 证书服务配置', status: 'Active' },
        ].map((item, i) => (
          <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-4 text-slate-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${item.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                <span className="text-sm text-slate-600 font-medium">{item.status === 'Active' ? '已启用' : '已禁用'}</span>
              </div>
              <button className="text-blue-600 text-sm font-semibold hover:underline underline-offset-4">配置详情</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralConfig;
