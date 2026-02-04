
import React from 'react';
import { Channel } from '../types';

const mockChannels: Channel[] = [
  { id: 'c1', name: '移动APP端', code: 'APP_CLIENT', feeRate: 0.05, status: 'Enabled', lastUpdated: '2024-05-18' },
  { id: 'c2', name: 'H5在线申请', code: 'H5_PAGE', feeRate: 0.08, status: 'Enabled', lastUpdated: '2024-05-19' },
  { id: 'c3', name: 'API开放平台', code: 'OPEN_API', feeRate: 0.12, status: 'Disabled', lastUpdated: '2024-05-10' },
  { id: 'c4', name: '线下网点录入', code: 'OFFLINE_STORE', feeRate: 0.03, status: 'Enabled', lastUpdated: '2024-05-20' },
];

const ChannelParamConfig: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">渠道参数管理</h2>
          <p className="text-slate-500 text-sm">配置不同获客渠道的服务费率、准入策略及接口参数</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all">
          新增渠道
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">渠道名称</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">渠道编码</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">服务费率</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">最后更新</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockChannels.map((channel) => (
              <tr key={channel.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{channel.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500"><code>{channel.code}</code></td>
                <td className="px-6 py-4 text-sm text-slate-700 font-semibold">{(channel.feeRate * 100).toFixed(2)}%</td>
                <td className="px-6 py-4 text-sm text-slate-500">{channel.lastUpdated}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    channel.status === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {channel.status === 'Enabled' ? '启用中' : '已停用'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-900 text-sm font-medium mr-4">详情</button>
                  <button className="text-slate-400 hover:text-slate-600 text-sm font-medium">配置</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChannelParamConfig;
