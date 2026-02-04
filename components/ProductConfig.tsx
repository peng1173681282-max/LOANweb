import React, { useState, useMemo } from 'react';
import { CreditProduct } from '../types';
import { getSmartProductSuggestion } from '../services/geminiService';

const mockProducts: CreditProduct[] = [
  { 
    id: '1', 
    code: '001001', 
    name: '快贷-工薪精英贷', 
    isRevolving: true, 
    creditTerm: '12',
    type: '信用贷', 
    apr: 4.8, 
    termRange: [3, 24], 
    amountRange: [1000, 50000], 
    status: 'Published', 
    createdAt: '2023-12-01' 
  },
  { 
    id: '2', 
    code: '002005', 
    name: '助力-小微经营抵押贷Pro', 
    isRevolving: false, 
    creditTerm: '60',
    type: '抵押贷', 
    apr: 3.65, 
    termRange: [12, 60], 
    amountRange: [50000, 1000000], 
    status: 'Draft', 
    createdAt: '2024-01-15' 
  },
];

const MODULES = [
  { id: 'basic', label: '基础信息', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'quota', label: '额度信息', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { id: 'interest', label: '利率管理', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
  { id: 'account', label: '账户管理', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' },
  { id: 'transaction', label: '交易规则', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { id: 'fee', label: '息费规则', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.599-1H11' },
  { id: 'repayment', label: '还款规则', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'return', label: '退货规则', icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
  { id: 'post-loan', label: '贷后管理', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: 'closure', label: '关户规则', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
];

// 固定的 4 个业务场景
const FIXED_SCENARIOS = [
  { id: 'cash_installment', label: '现金分期', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.599-1H11' },
  { id: 'consume_installment', label: '消费分期', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'withdraw_repay_cash', label: '随借随还取现', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'withdraw_repay_consume', label: '随借随还消费', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
];

// 已在贷款类型配置中维护好的类型数据源（增加了分类，用于限定范围）
const MAINTAINED_LOAN_TYPES = [
  { code: 'LP001', name: '标准现金分期', category: 'cash_installment' },
  { code: 'LP002', name: '大额优选现金分期', category: 'cash_installment' },
  { code: 'LP003', name: '双11促销消费分期', category: 'consume_installment' },
  { code: 'LP004', name: '教育场景分期', category: 'consume_installment' },
  { code: 'LP005', name: '极速随借随还(取现)', category: 'withdraw_repay_cash' },
  { code: 'LP006', name: '灵活商户随借随还', category: 'withdraw_repay_consume' },
  { code: 'LP007', name: '精英贷专项(现金)', category: 'cash_installment' },
];

const ProductConfig: React.FC = () => {
  const [products, setProducts] = useState<CreditProduct[]>(mockProducts);
  const [isEditing, setIsEditing] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState('basic');
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  
  // 搜索和下拉状态管理
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showAiModal, setShowAiModal] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const handleEdit = (product: CreditProduct | null) => {
    setCurrentProduct(product || {
      code: '',
      name: '',
      isRevolving: true,
      creditTerm: '',
      currency: 'CNY',
      accountingRule: 'ourCompany',
      brandType: 'jiebei',
      supportTempQuota: 'no',
      supportFixedQuotaAdjust: 'no',
      rateMin: '',
      rateMax: '',
      regCap: '',
      waiverMethod: 'realtime',
      penaltyMultiple: '1.5',
      dailyRateBase: '360',
      billCycle: 'month',
      billDayLogic: 'accountDay',
      repaymentDays: '10',
      gracePeriodDays: '3',
      scenarioMapping: {
        cash_installment: '',
        consume_installment: '',
        withdraw_repay_cash: '',
        withdraw_repay_consume: ''
      },
      consolidatedBillDays: '3',
      firstPeriodInterestLogic: 'by_day',
      dailyCashMaxCount: '',
      singleCashMaxAmount: '',
      dailyTransMaxCount: '',
      singleTransMaxAmount: '',
      // 新增息费规则字段
      hasPenalty: 'yes',
      hasCompoundInterest: 'no',
      penaltyBase: 'overduePrincipal',
      penaltyAccountingLocation: 'overduePeriod',
      // 初始化 提前结清规则 9项清单字段
      allowPrepayment: 'yes', // 1、是否允许提前结清
      earliestPrepaymentPeriod: '1', // 2、最早支持提前结清的期次
      prepaymentFeeRule: 'none', // 3、提前结清手续费收取规则
      prepaymentFeeBase: 'remainingPrincipal', // 4、提前结清手续费基数
      prepaymentFeeRate: '', // 5、提前结清手续费比例
      prepaymentFeeAmountMin: '', // 6、提前结清手续费金额区间-最小
      prepaymentFeeAmountMax: '', // 6、提前结清手续费金额区间-最大
      prepaymentInterestRule: 'none', // 7、提前结清利息收取规则
      prepaymentInterestBase: 'remainingPrincipal', // 8、提前结清利息基数
      prepaymentInterestRate: '', // 9、提前结清利息比例
      // 初始化还款规则新增字段
      supportOfflineRepay: 'no',
      supportQuickRepay: 'no',
      supportSingleDeduction: 'no',
      supportBatchDeduction: 'no',
      supportAgentWaiver: 'no',
      overpaymentBatchRefund: 'no',
      overpaymentOffsetArrears: 'no',
      overpaymentOffsetOtherLoans: 'no'
    });
    setActiveModuleId('basic');
    setIsEditing(true);
    setOpenDropdownId(null);
    setSearchQuery('');
  };

  const handleSave = () => {
    if (currentProduct) {
      if (currentProduct.id) {
        setProducts(products.map(p => p.id === currentProduct.id ? { ...p, ...currentProduct } as CreditProduct : p));
      } else {
        const newProduct = {
          ...currentProduct,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString().split('T')[0]
        } as CreditProduct;
        setProducts([...products, newProduct]);
      }
    }
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const handleAiSuggest = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const result = await getSmartProductSuggestion(prompt);
      setAiResult(result);
    } catch (error) {
      console.error(error);
      alert('AI 生成失败，请检查网络或配置');
    } finally {
      setLoading(false);
    }
  };

  const applyAiResult = () => {
    if (aiResult) {
      setCurrentProduct({
        ...currentProduct,
        name: aiResult.name,
        creditTerm: aiResult.maxTerm?.toString() || '',
      });
      setShowAiModal(false);
      setAiResult(null);
      setPrompt('');
    }
  };

  const updateScenarioCode = (scenarioId: string, code: string) => {
    setCurrentProduct({
      ...currentProduct,
      scenarioMapping: {
        ...currentProduct.scenarioMapping,
        [scenarioId]: code
      }
    });
    setOpenDropdownId(null);
    setSearchQuery('');
  };

  // 根据分类过滤后的贷款类型
  const getFilteredTypes = (categoryId: string) => {
    return MAINTAINED_LOAN_TYPES.filter(type => 
      type.category === categoryId && 
      (type.name.includes(searchQuery) || type.code.includes(searchQuery))
    );
  };

  const renderModuleContent = () => {
    switch (activeModuleId) {
      case 'basic':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">基础信息配置</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">产品编码 <span className="text-red-500">*</span></label>
                <input 
                  type="text" maxLength={6} placeholder="请输入6位数字编码"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                  value={currentProduct?.code || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, code: e.target.value.replace(/\D/g, '')})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">产品名称 <span className="text-red-500">*</span></label>
                <input 
                  type="text" placeholder="请输入产品名称"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                  value={currentProduct?.name || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">币种 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.currency || 'CNY'}
                    onChange={(e) => setCurrentProduct({...currentProduct, currency: e.target.value})}
                  >
                    <option value="CNY">CNY - 人民币</option>
                    <option value="USD">USD - 美元</option>
                    <option value="EUR">EUR - 欧元</option>
                    <option value="HKD">HKD - 港币</option>
                    <option value="GBP">GBP - 英镑</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">账务规则 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.accountingRule || 'ourCompany'}
                    onChange={(e) => setCurrentProduct({...currentProduct, accountingRule: e.target.value})}
                  >
                    <option value="partner">以合作方为准</option>
                    <option value="ourCompany">以我司为准</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">品牌类型 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.brandType || 'jiebei'}
                    onChange={(e) => setCurrentProduct({...currentProduct, brandType: e.target.value})}
                  >
                    <option value="jiebei">借呗品牌</option>
                    <option value="huabei">花呗品牌</option>
                    <option value="channel">渠道合作产品</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-slate-700">产品描述</label>
                <textarea 
                  placeholder="请输入产品业务描述"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm h-24 resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 'quota':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">额度信息配置</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">额度期限 (月) <span className="text-red-500">*</span></label>
                <input 
                  type="text" placeholder="请输入月数，例如：12、24"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                  value={currentProduct?.creditTerm || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, creditTerm: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">额度类型 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.isRevolving ? 'revolving' : 'non-revolving'}
                    onChange={(e) => setCurrentProduct({...currentProduct, isRevolving: e.target.value === 'revolving'})}
                  >
                    <option value="revolving">循环</option>
                    <option value="non-revolving">非循环</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">是否支持临时额度 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.supportTempQuota || 'no'}
                    onChange={(e) => setCurrentProduct({...currentProduct, supportTempQuota: e.target.value})}
                  >
                    <option value="yes">是</option>
                    <option value="no">否</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">是否支持调整固定额度 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.supportFixedQuotaAdjust || 'no'}
                    onChange={(e) => setCurrentProduct({...currentProduct, supportFixedQuotaAdjust: e.target.value})}
                  >
                    <option value="yes">是</option>
                    <option value="no">否</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">最小授信额度 (元)</label>
                <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="1000" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">最大授信额度 (元)</label>
                <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="50000" />
              </div>
            </div>
          </div>
        );
      case 'interest':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">利率管理配置</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-slate-700">利率上下限区间 (%) <span className="text-red-500">*</span></label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-2.5 text-slate-400 text-sm">[</span>
                    <input 
                      type="number" step="0.01" placeholder="下限"
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={currentProduct?.rateMin || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, rateMin: e.target.value})}
                    />
                  </div>
                  <span className="text-slate-400">至</span>
                  <div className="flex-1 relative">
                    <input 
                      type="number" step="0.01" placeholder="上限"
                      className="w-full pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={currentProduct?.rateMax || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, rateMax: e.target.value})}
                    />
                    <span className="absolute right-4 top-2.5 text-slate-400 text-sm">]</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">注：包含上下限数值</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">监管实收息费上限 (%) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-slate-400 text-sm">(</span>
                  <input 
                    type="number" step="0.01" placeholder="上限值"
                    className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={currentProduct?.regCap || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, regCap: e.target.value})}
                  />
                  <span className="absolute right-4 top-2.5 text-slate-400 text-sm">)</span>
                </div>
                <p className="text-[10px] text-slate-400">注：不包含此数值</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">减免方式 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.waiverMethod || 'realtime'}
                    onChange={(e) => setCurrentProduct({...currentProduct, waiverMethod: e.target.value})}
                  >
                    <option value="realtime">实时减免</option>
                    <option value="settlement">结清减免</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">日利率计算基础 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.dailyRateBase || '360'}
                    onChange={(e) => setCurrentProduct({...currentProduct, dailyRateBase: e.target.value})}
                  >
                    <option value="360">360天</option>
                    <option value="365">365天</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-bold text-slate-700">利息计算基础 (备注)</label>
                <p className="text-xs text-slate-400">通常用于日利率换算：日利率 = 年利率 / 计算基础天数</p>
              </div>
            </div>
          </div>
        );
      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">账户管理配置</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">账单周期 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.billCycle || 'month'}
                    onChange={(e) => setCurrentProduct({...currentProduct, billCycle: e.target.value})}
                  >
                    <option value="month">月</option>
                    <option value="week">星期</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">账单日逻辑 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                    value={currentProduct?.billDayLogic || 'accountDay'}
                    onChange={(e) => setCurrentProduct({...currentProduct, billDayLogic: e.target.value})}
                  >
                    <option value="accountDay">开户日对日 (29/30/31跳1/2/3)</option>
                    <option value="fixed">固定账单日</option>
                    <option value="firstLoan">首次贷款更新账单日 (29/30/31跳1/2/3)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">还款日天数 <span className="text-red-500">*</span></label>
                <input 
                  type="text" placeholder="账单日后多少天还款"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                  value={currentProduct?.repaymentDays || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, repaymentDays: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">宽限日天数 <span className="text-red-500">*</span></label>
                <input 
                  type="text" placeholder="还款日后宽限天数"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                  value={currentProduct?.gracePeriodDays || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, gracePeriodDays: e.target.value})}
                />
              </div>

              <div className="col-span-2 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-3">
                 <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <div className="text-xs text-amber-800 space-y-1">
                   <p className="font-bold">账单逻辑说明：</p>
                   <p>1. 周期逻辑会自动处理大小月差异，29、30、31日开户将顺延至下月1、2、3日作为固定还款逻辑。</p>
                   <p>2. 还款日 = 账单日 + 还款日天数；逾期计算起始于宽限日次日。</p>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'transaction':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">交易规则配置</h3>
            <div className="grid grid-cols-2 gap-8">
              {/* 取现规则 */}
              <div className="col-span-2 md:col-span-1 space-y-4">
                <h4 className="flex items-center text-sm font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  取现限制
                </h4>
                <div className="space-y-4 px-1">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">每日取现最大笔数 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" placeholder="请输入笔数，如：5"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                      value={currentProduct?.dailyCashMaxCount || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, dailyCashMaxCount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">单笔取现最大金额 (元) <span className="text-red-500">*</span></label>
                    <input 
                      type="text" placeholder="请输入金额，如：50000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                      value={currentProduct?.singleCashMaxAmount || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, singleCashMaxAmount: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* 消费规则 */}
              <div className="col-span-2 md:col-span-1 space-y-4">
                <h4 className="flex items-center text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  消费限制
                </h4>
                <div className="space-y-4 px-1">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">每日消费最大笔数 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" placeholder="请输入笔数，如：20"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                      value={currentProduct?.dailyTransMaxCount || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, dailyTransMaxCount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">单笔消费最大金额 (元) <span className="text-red-500">*</span></label>
                    <input 
                      type="text" placeholder="请输入金额，如：100000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                      value={currentProduct?.singleTransMaxAmount || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, singleTransMaxAmount: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-700">风险提示：</span> 
                  交易规则配置将直接影响核心风控引擎。每日累计额度与单笔限额共同生效。如果当前产品支持多渠道交易，此处配置将作为全局默认规则，除非特定渠道配置了更严格的覆盖参数。
                </p>
              </div>
            </div>
          </div>
        );
      case 'fee':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">息费规则配置</h3>
            <div className="space-y-8">
              {/* 贷款类型配置 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-700">贷款类型配置 <span className="text-red-500">*</span></label>
                  <span className="text-[10px] text-slate-400">基于“场景限定 + 搜索关联”机制</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {FIXED_SCENARIOS.map((scenario) => {
                    const selectedCode = currentProduct?.scenarioMapping?.[scenario.id];
                    const selectedType = MAINTAINED_LOAN_TYPES.find(t => t.code === selectedCode);
                    const isOpen = openDropdownId === scenario.id;
                    const filteredTypes = getFilteredTypes(scenario.id);

                    return (
                      <div key={scenario.id} className="relative">
                        <div 
                          onClick={() => {
                            if (openDropdownId === scenario.id) {
                              setOpenDropdownId(null);
                            } else {
                              setOpenDropdownId(scenario.id);
                              setSearchQuery('');
                            }
                          }}
                          className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                            isOpen ? 'bg-white border-blue-500 shadow-lg ring-2 ring-blue-50' : 'bg-slate-50 border-slate-200 hover:border-blue-200 hover:bg-white'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                            selectedCode ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-400'
                          }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={scenario.icon} />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0 mr-6">
                            <p className="text-sm font-bold text-slate-800">{scenario.label}</p>
                            <p className="text-[10px] text-slate-400">限定分类范围: {scenario.label}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {selectedCode ? (
                              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                <span className="text-xs font-mono font-bold text-blue-700">[{selectedCode}]</span>
                                <span className="text-xs font-medium text-slate-700">{selectedType?.name}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">未关联编码</span>
                            )}
                            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="p-3 border-b border-slate-50 bg-slate-50/50 flex items-center space-x-3">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <input 
                                autoFocus
                                type="text" 
                                placeholder="搜索编码或名称..."
                                className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-slate-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto py-2">
                              {filteredTypes.length > 0 ? (
                                filteredTypes.map((type) => (
                                  <div 
                                    key={type.code}
                                    onClick={(e) => { e.stopPropagation(); updateScenarioCode(scenario.id, type.code); }}
                                    className={`px-4 py-2.5 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors ${selectedCode === type.code ? 'bg-blue-50' : ''}`}
                                  >
                                    <div className="flex flex-col">
                                      <span className={`text-xs font-bold ${selectedCode === type.code ? 'text-blue-700' : 'text-slate-700'}`}>{type.name}</span>
                                      <span className="text-[10px] text-slate-400 font-mono">Code: {type.code}</span>
                                    </div>
                                    {selectedCode === type.code && (
                                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-6 text-center">
                                  <p className="text-xs text-slate-400">未找到匹配的维护编码</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 罚息配置 */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  罚息配置
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">是否收取罚息 <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.hasPenalty || 'yes'}
                      onChange={(e) => setCurrentProduct({...currentProduct, hasPenalty: e.target.value})}
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">罚息计算基数 <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.penaltyBase || 'overduePrincipal'}
                      onChange={(e) => setCurrentProduct({...currentProduct, penaltyBase: e.target.value})}
                    >
                      <option value="overduePrincipal">逾期本金</option>
                      <option value="remainingPrincipal">剩余未还本金</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 提前结清规则模块 - 精准替换部分 */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="text-sm font-bold text-indigo-700 flex items-center bg-indigo-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  提前结清规则
                </h4>
                <div className="grid grid-cols-2 gap-6 px-1">
                  {/* 1. 是否允许提前结清 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">1、是否允许提前结清 <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                        value={currentProduct?.allowPrepayment || 'yes'}
                        onChange={(e) => setCurrentProduct({...currentProduct, allowPrepayment: e.target.value})}
                      >
                        <option value="yes">是</option>
                        <option value="no">否</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* 2. 最早支持提前结清的期次 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">2、最早支持提前结清的期次 <span className="text-red-500">*</span></label>
                    <input 
                      type="number" min="1" placeholder="请输入期次，如：1"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-50"
                      disabled={currentProduct?.allowPrepayment === 'no'}
                      value={currentProduct?.earliestPrepaymentPeriod || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, earliestPrepaymentPeriod: e.target.value})}
                    />
                  </div>

                  {/* 3. 提前结清手续费收取规则 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">3、提前结清手续费收取规则 <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer disabled:opacity-50"
                        disabled={currentProduct?.allowPrepayment === 'no'}
                        value={currentProduct?.prepaymentFeeRule || 'none'}
                        onChange={(e) => setCurrentProduct({...currentProduct, prepaymentFeeRule: e.target.value})}
                      >
                        <option value="none">不收取</option>
                        <option value="proportional">按比例收取</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* 4. 提前结清手续费基数 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">4、提前结清手续费基数</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer disabled:opacity-50"
                        disabled={currentProduct?.prepaymentFeeRule === 'none' || currentProduct?.allowPrepayment === 'no'}
                        value={currentProduct?.prepaymentFeeBase || 'remainingPrincipal'}
                        onChange={(e) => setCurrentProduct({...currentProduct, prepaymentFeeBase: e.target.value})}
                      >
                        <option value="remainingPrincipal">剩余未还本金</option>
                        <option value="unbilledPrincipal">未出账本金</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* 5. 提前结清手续费比例 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">5、提前结清手续费比例 (%)</label>
                    <input 
                      type="number" step="0.01" placeholder="如：2.00"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-50"
                      disabled={currentProduct?.prepaymentFeeRule === 'none' || currentProduct?.allowPrepayment === 'no'}
                      value={currentProduct?.prepaymentFeeRate || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, prepaymentFeeRate: e.target.value})}
                    />
                  </div>

                  {/* 6. 提前结清手续费金额区间 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">6、提前结清手续费金额区间</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" placeholder="最小"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm disabled:opacity-50"
                        disabled={currentProduct?.prepaymentFeeRule === 'none' || currentProduct?.allowPrepayment === 'no'}
                        value={currentProduct?.prepaymentFeeAmountMin || ''}
                        onChange={(e) => setCurrentProduct({...currentProduct, prepaymentFeeAmountMin: e.target.value})}
                      />
                      <span className="text-slate-400">-</span>
                      <input 
                        type="number" placeholder="最大"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm disabled:opacity-50"
                        disabled={currentProduct?.prepaymentFeeRule === 'none' || currentProduct?.allowPrepayment === 'no'}
                        value={currentProduct?.prepaymentFeeAmountMax || ''}
                        onChange={(e) => setCurrentProduct({...currentProduct, prepaymentFeeAmountMax: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* 7. 提前结清利息收取规则 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">7、提前结清利息收取规则 <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer disabled:opacity-50"
                        disabled={currentProduct?.allowPrepayment === 'no'}
                        value={currentProduct?.prepaymentInterestRule || 'none'}
                        onChange={(e) => setCurrentProduct({...currentProduct, prepaymentInterestRule: e.target.value})}
                      >
                        <option value="none">不收取</option>
                        <option value="proportional">按比例收取</option>
                        <option value="fullPeriod">收取整期</option>
                        <option value="allInterest">收取所有贷款利息</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* 8. 提前结清利息基数 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">8、提前结清利息基数</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer disabled:opacity-50"
                        disabled={currentProduct?.prepaymentInterestRule === 'none' || currentProduct?.allowPrepayment === 'no'}
                        value={currentProduct?.prepaymentInterestBase || 'remainingPrincipal'}
                        onChange={(e) => setCurrentProduct({...currentProduct, prepaymentInterestBase: e.target.value})}
                      >
                        <option value="remainingPrincipal">剩余未还本金</option>
                        <option value="unbilledPrincipal">未出账本金</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* 9. 提前结清利息比例 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">9、提前结清利息比例 (%)</label>
                    <input 
                      type="number" step="0.01" placeholder="如：1.50"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-50"
                      disabled={currentProduct?.prepaymentInterestRule === 'none' || currentProduct?.allowPrepayment === 'no'}
                      value={currentProduct?.prepaymentInterestRate || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, prepaymentInterestRate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'repayment':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">还款规则配置</h3>
            
            {/* 还款模块 */}
            <div className="space-y-4">
              <h4 className="flex items-center text-sm font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                还款模块
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">是否支持线下还款 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.supportOfflineRepay || 'no'}
                      onChange={(e) => setCurrentProduct({...currentProduct, supportOfflineRepay: e.target.value})}
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">是否支持快捷还款 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.supportQuickRepay || 'no'}
                      onChange={(e) => setCurrentProduct({...currentProduct, supportQuickRepay: e.target.value})}
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">是否支持单笔划扣 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.supportSingleDeduction || 'no'}
                      onChange={(e) => setCurrentProduct({...currentProduct, supportSingleDeduction: e.target.value})}
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">是否支持批量扣款 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.supportBatchDeduction || 'no'}
                      onChange={(e) => setCurrentProduct({...currentProduct, supportBatchDeduction: e.target.value})}
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">是否支持坐席豁免 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.supportAgentWaiver || 'no'}
                      onChange={(e) => setCurrentProduct({...currentProduct, supportAgentWaiver: e.target.value})}
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 溢缴款模块 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="flex items-center text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded-lg">
                溢缴款模块
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">溢缴款是否支持批量退还 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.overpaymentBatchRefund || 'no'}
                      onChange={(e) => setCurrentProduct({...currentProduct, overpaymentBatchRefund: e.target.value})}
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">溢缴款是否支持抵扣欠款 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.overpaymentOffsetArrears || 'no'}
                      onChange={(e) => setCurrentProduct({...currentProduct, overpaymentOffsetArrears: e.target.value})}
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">溢缴款是否支持抵扣其他借据 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
                      value={currentProduct?.overpaymentOffsetOtherLoans || 'no'}
                      onChange={(e) => setCurrentProduct({...currentProduct, overpaymentOffsetOtherLoans: e.target.value})}
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <p className="text-sm font-medium">[{MODULES.find(m => m.id === activeModuleId)?.label}] 模块详情正在开发中...</p>
            <p className="text-xs mt-1">此处将包含深度的业务配置项与逻辑引擎控制参数</p>
          </div>
        );
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300" onClick={() => setOpenDropdownId(null)}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {currentProduct?.id ? '编辑产品配置' : '新增产品配置'}
              </h2>
              <div className="flex items-center mt-1">
                <span className="text-xs text-slate-400">产品状态: </span>
                <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">草稿</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}
              className="px-6 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-all"
            >
              取消
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              className="px-8 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              暂存并提交
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm" onClick={(e) => e.stopPropagation()}>
          {/* 左侧模块导航 */}
          <div className="w-64 bg-slate-50/50 border-r border-slate-100 flex flex-col">
            <div className="p-4 uppercase tracking-widest text-[10px] font-bold text-slate-400">
              配置中心模块
            </div>
            <nav className="flex-1 overflow-y-auto px-2 space-y-1">
              {MODULES.map((module) => (
                <button
                  key={module.id}
                  onClick={() => { setActiveModuleId(module.id); setOpenDropdownId(null); }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeModuleId === module.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={module.icon} />
                  </svg>
                  {module.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 右侧表单内容 */}
          <div className="flex-1 overflow-y-auto p-10 bg-white" onClick={() => setOpenDropdownId(null)}>
            <div className="max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>
              {renderModuleContent()}
              
              {/* 全局辅助按钮 */}
              <div className="mt-20 pt-10 border-t border-slate-50 grid grid-cols-2 gap-4">
                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h5 className="font-bold text-slate-800 text-sm mb-2">配置帮助</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      正在编辑 [{MODULES.find(m => m.id === activeModuleId)?.label}] 模块。如果需要 AI 协助生成该模块的专家参数，请点击顶部“AI 智能方案”按钮。
                    </p>
                 </div>
                 <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <h5 className="font-bold text-blue-800 text-sm mb-2">快速操作</h5>
                    <div className="flex space-x-2">
                      <button className="text-[10px] font-bold px-2 py-1 bg-white border border-blue-200 text-blue-600 rounded">复制历史配置</button>
                      <button className="text-[10px] font-bold px-2 py-1 bg-white border border-blue-200 text-blue-600 rounded">检查冲突</button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">产品基础配置</h2>
          <p className="text-slate-500 text-sm">管理信贷产品的核心业务要素与产品生命周期</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAiModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 border border-indigo-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI 智能方案
          </button>
          <button 
            onClick={() => handleEdit(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all active:scale-95"
          >
            新增产品
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">产品编码</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">产品名称</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">循环额度</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">额度期限 (月)</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-sm font-mono font-medium text-slate-500">{p.code}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                    {p.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    p.isRevolving ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.isRevolving ? '循环' : '非循环'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 font-medium">
                    {p.creditTerm}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button 
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors"
                  >
                    编辑
                  </button>
                  <button 
                    className="text-slate-400 hover:text-indigo-600 text-sm font-bold transition-colors"
                  >
                    复制
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-inner">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">AI 智能产品设计助手</h3>
                  <p className="text-sm text-slate-500">描述您的需求，AI 将为您推荐 product 参数</p>
                </div>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">描述您的信贷产品</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：为中小微企业主设计的短期低息抵押贷款，额度在50万到200万之间，期限不超过一年。"
                  className="w-full h-32 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none transition-all outline-none"
                />
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-slate-500 animate-pulse text-sm font-medium">正在分析市场数据并为您设计最佳方案...</p>
                </div>
              )}

              {aiResult && !loading && (
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h4 className="font-bold text-indigo-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    推荐配置方案
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">建议产品名称</p>
                      <p className="font-bold text-slate-800">{aiResult.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">建议利率</p>
                      <p className="font-bold text-indigo-600">{aiResult.apr}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">目标客群</p>
                      <p className="font-bold text-slate-800 truncate">{aiResult.targetAudience || '通用'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">额度建议</p>
                      <p className="font-bold text-slate-800">¥{aiResult.minAmount} - ¥{aiResult.maxAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">期限建议</p>
                      <p className="font-bold text-slate-800">{aiResult.minTerm} - {aiResult.maxTerm} 月</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAiModal(false)}
                className="px-6 py-2 text-slate-600 font-medium text-sm hover:bg-slate-200 rounded-xl transition-colors"
              >
                取消
              </button>
              {!aiResult ? (
                <button 
                  onClick={handleAiSuggest}
                  disabled={loading || !prompt}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-100 transition-all"
                >
                  开始生成
                </button>
              ) : (
                <button 
                  onClick={applyAiResult}
                  className="px-6 py-2 bg-green-600 text-white font-medium text-sm rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
                >
                  采纳方案
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductConfig;