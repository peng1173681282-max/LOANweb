
import React from 'react';
import { SystemLog } from '../types';

const mockLogs: SystemLog[] = [
  { id: 'l1', user: '张晓明', action: '修改产品利率 [快贷]', time: '2024-05-20 14:23:11', status: 'Success' },
  { id: 'l2', user: '李华', action: '删除贷款类型 [农信贷]', time: '2024-05-20 12:05:44', status: 'Success' },
  { id: 'l3', user: '系统自动', action: '数据库备份', time: '2024-05-20 03:00:00', status: 'Success' },
  { id: 'l4', user: '张晓明', action: '登录失败', time: '2024-05-19 22:15:33', status: 'Failure' },
];

const SystemAdmin: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">系统操作日志</h3>
            <div className="space-y-4">
              {mockLogs.map((log) => (
                <div key={log.id} className="flex items-start p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-4 ${
                    log.status === 'Success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {log.status === 'Success' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{log.action}</p>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <span className="mr-3">操作人: {log.user}</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
              查看全部审计日志
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">系统健康度</h3>
            <div className="space-y-6">
              {[
                { label: 'CPU 使用率', value: '14%', color: 'blue' },
                { label: '内存 使用率', value: '62%', color: 'indigo' },
                { label: '存储 剩余', value: '88%', color: 'green' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-800">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${item.color}-500 rounded-full`} 
                      style={{ width: item.value }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
            <h3 className="text-lg font-bold mb-2">版本信息</h3>
            <p className="text-blue-100 text-sm mb-4">当前系统版本: Pro v2.4.1 (Stable)</p>
            <div className="space-y-2">
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                检查更新
              </button>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                系统备份
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdmin;
