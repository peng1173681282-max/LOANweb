
import React from 'react';
import { MenuKey } from '../types';

interface HeaderProps {
  activeMenu: MenuKey;
}

const Header: React.FC<HeaderProps> = ({ activeMenu }) => {
  const getBreadcrumbs = () => {
    switch (activeMenu) {
      case MenuKey.PRODUCT_BASIC: return ['产品管理', '产品基础配置'];
      case MenuKey.LOAN_TYPE: return ['产品管理', '贷款类型配置'];
      case MenuKey.PRODUCT_GENERAL: return ['产品管理', '产品通用配置'];
      case MenuKey.CHANNEL_PARAM: return ['产品管理', '渠道参数管理'];
      case MenuKey.FUNDER_MGMT: return ['资方管理'];
      case MenuKey.SYSTEM_ADMIN: return ['系统管理'];
      default: return ['首页'];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center space-x-2 text-sm text-slate-500">
        <span className="hover:text-blue-600 cursor-pointer">信贷系统</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className={idx === breadcrumbs.length - 1 ? "font-bold text-slate-800" : "text-slate-500"}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-4">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          系统状态: 正常
        </div>
        
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
