
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProductConfig from './components/ProductConfig';
import LoanTypeConfig from './components/LoanTypeConfig';
import GeneralConfig from './components/GeneralConfig';
import ChannelParamConfig from './components/ChannelParamConfig';
import FunderManagement from './components/FunderManagement';
import SystemAdmin from './components/SystemAdmin';
import { MenuKey } from './types';

const App: React.FC = () => {
  // 默认定位到产品基础配置
  const [activeMenu, setActiveMenu] = useState<MenuKey>(MenuKey.PRODUCT_BASIC);

  const renderContent = () => {
    switch (activeMenu) {
      case MenuKey.PRODUCT_BASIC:
        return <ProductConfig />;
      case MenuKey.LOAN_TYPE:
        return <LoanTypeConfig />;
      case MenuKey.PRODUCT_GENERAL:
        return <GeneralConfig />;
      case MenuKey.CHANNEL_PARAM:
        return <ChannelParamConfig />;
      case MenuKey.FUNDER_MGMT:
        return <FunderManagement />;
      case MenuKey.SYSTEM_ADMIN:
        return <SystemAdmin />;
      default:
        return <ProductConfig />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Header activeMenu={activeMenu} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
