
import React, { useState } from 'react';
import { MenuKey } from '../types';

interface SidebarProps {
  activeMenu: MenuKey;
  onMenuChange: (key: MenuKey) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const [productExpanded, setProductExpanded] = useState(true);

  const isProductActive = [
    MenuKey.PRODUCT_BASIC, 
    MenuKey.LOAN_TYPE, 
    MenuKey.PRODUCT_GENERAL,
    MenuKey.CHANNEL_PARAM
  ].includes(activeMenu);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.599-1H11" />
          </svg>
        </div>
        <span className="text-lg font-bold text-slate-800 tracking-tight">信贷工厂Pro</span>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {/* 产品管理一级 */}
          <li>
            <button
              onClick={() => setProductExpanded(!productExpanded)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isProductActive ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                产品管理
              </div>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${productExpanded ? 'rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* 产品管理二级菜单 */}
            <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-200 ${productExpanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
              {[
                { key: MenuKey.PRODUCT_BASIC, label: '产品基础配置' },
                { key: MenuKey.LOAN_TYPE, label: '贷款类型配置' },
                { key: MenuKey.PRODUCT_GENERAL, label: '产品通用配置' },
                { key: MenuKey.CHANNEL_PARAM, label: '渠道参数管理' },
              ].map((sub) => (
                <button
                  key={sub.key}
                  onClick={() => onMenuChange(sub.key)}
                  className={`w-full flex items-center pl-12 pr-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeMenu === sub.key
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </li>

          {/* 资方管理 */}
          <li>
            <button
              onClick={() => onMenuChange(MenuKey.FUNDER_MGMT)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeMenu === MenuKey.FUNDER_MGMT
                  ? 'sidebar-active shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              资方管理
            </button>
          </li>

          {/* 系统管理 */}
          <li>
            <button
              onClick={() => onMenuChange(MenuKey.SYSTEM_ADMIN)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeMenu === MenuKey.SYSTEM_ADMIN
                  ? 'sidebar-active shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              系统管理
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 flex items-center">
          <img src="https://picsum.photos/40/40?grayscale" alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200" />
          <div className="ml-3 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">管理员</p>
            <p className="text-xs text-slate-500 truncate">admin@credit.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
