import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, 
  Calendar, Download, Filter, Search, RefreshCw, Eye, Users,
  Target, Award, AlertTriangle, CheckCircle, Clock, Receipt,
  CreditCard, Building2, Smartphone, Globe, ArrowUpRight,
  ArrowDownRight, MoreVertical, FileText, Send, Mail, Phone,
  MapPin, Star, Package, Activity, Zap, Info, Settings,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight
} from 'lucide-react';

const FinancialReportingDashboard = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('this-month');
  const [reportType, setReportType] = useState('revenue');
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [expandedSection, setExpandedSection] = useState(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Financial data
  const financialData = {
    overview: {
      totalRevenue: 2450000,
      revenueGrowth: 12.5,
      serviceFees: 367500,
      feesGrowth: 15.2,
      vatCollected: 171500,
      netProfit: 539000,
      profitGrowth: 18.7,
      activeTrainers: 256,
      trainerGrowth: 8.3,
      totalTransactions: 1247,
      transactionGrowth: 22.1,
      averagePackageValue: 1965,
      packageValueGrowth: 5.4,
      collectionRate: 94.2,
      collectionGrowth: 2.1,
      outstandingAmount: 78500
    },
    revenueBreakdown: {
      trainerRevenue: 2450000,
      serviceFees: 367500,
      vat: 171500,
      processingFees: 12250,
      totalIncome: 551250
    },
    paymentMethods: [
      { method: 'บัตรเครดิต/เดบิต', amount: 1470000, percentage: 60, transactions: 748, growth: 15.2 },
      { method: 'พร้อมเพย์', amount: 612500, percentage: 25, transactions: 312, growth: 25.8 },
      { method: 'โอนธนาคาร', amount: 367500, percentage: 15, transactions: 187, growth: 8.1 }
    ],
    topTrainers: [
      { id: 'TR001', name: 'โค้ชแมท', revenue: 156000, sessions: 52, clients: 28, growth: 18.5 },
      { id: 'TR002', name: 'โค้ชมิกซ์', revenue: 145000, sessions: 48, clients: 25, growth: 22.3 },
      { id: 'TR003', name: 'โค้ชจิม', revenue: 138000, sessions: 46, clients: 24, growth: 15.7 },
      { id: 'TR004', name: 'โค้ชแอนน์', revenue: 125000, sessions: 42, clients: 22, growth: 12.1 },
      { id: 'TR005', name: 'โค้ชซาร่า', revenue: 118000, sessions: 39, clients: 20, growth: 28.9 }
    ],
    monthlyData: [
      { month: 'ม.ค.', revenue: 1850000, fees: 277500, transactions: 924 },
      { month: 'ก.พ.', revenue: 1920000, fees: 288000, transactions: 961 },
      { month: 'มี.ค.', revenue: 2100000, fees: 315000, transactions: 1052 },
      { month: 'เม.ย.', revenue: 2250000, fees: 337500, transactions: 1127 },
      { month: 'พ.ค.', revenue: 2380000, fees: 357000, transactions: 1189 },
      { month: 'มิ.ย.', revenue: 2450000, fees: 367500, transactions: 1247 }
    ],
    geographicData: [
      { region: 'กรุงเทพฯ', revenue: 980000, percentage: 40, trainers: 102 },
      { region: 'ปริมณฑล', revenue: 612500, percentage: 25, trainers: 64 },
      { region: 'ภาคกลาง', revenue: 367500, percentage: 15, trainers: 38 },
      { region: 'ภาคใต้', revenue: 245000, percentage: 10, trainers: 26 },
      { region: 'ภาคเหนือ', revenue: 245000, percentage: 10, trainers: 26 }
    ]
  };

  const formatCurrency = (amount) => `฿${amount.toLocaleString()}`;
  const formatPercentage = (value) => `${value}%`;

  // Render Overview Tab
  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: windowWidth <= 768 ? 
          'repeat(2, 1fr)' : 
          'repeat(4, 1fr)',
        gap: '1.5rem'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>รายได้รวม</span>
            <DollarSign size={20} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {formatCurrency(financialData.overview.totalRevenue)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={16} style={{ color: 'var(--success)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
              +{financialData.overview.revenueGrowth}%
            </span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ค่าบริการ</span>
            <Receipt size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {formatCurrency(financialData.overview.serviceFees)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={16} style={{ color: 'var(--success)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
              +{financialData.overview.feesGrowth}%
            </span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>กำไรสุทธิ</span>
            <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {formatCurrency(financialData.overview.netProfit)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={16} style={{ color: 'var(--success)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
              +{financialData.overview.profitGrowth}%
            </span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>เทรนเนอร์ใช้งาน</span>
            <Users size={20} style={{ color: 'var(--info)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {financialData.overview.activeTrainers}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={16} style={{ color: 'var(--success)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
              +{financialData.overview.trainerGrowth}%
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: windowWidth <= 768 ? '1fr' : '2fr 1fr',
        gap: '1.5rem'
      }}>
        {/* Revenue Chart */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
              แนวโน้มรายได้
            </h3>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="this-month">เดือนนี้</option>
              <option value="last-month">เดือนที่แล้ว</option>
              <option value="this-quarter">ไตรมาสนี้</option>
              <option value="this-year">ปีนี้</option>
            </select>
          </div>
          
          {/* Simple chart representation */}
          <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
            {financialData.monthlyData.map((data, index) => (
              <div key={data.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    height: `${(data.revenue / 2500000) * 180}px`,
                    backgroundColor: index === financialData.monthlyData.length - 1 ? 'var(--accent)' : 'var(--primary)',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: '0.5rem',
                    minHeight: '20px'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 1.5rem 0' }}>
            ช่องทางการชำระ
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {financialData.paymentMethods.map((method, index) => (
              <div key={method.method}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {method.method}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                    {method.percentage}%
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${method.percentage}%`,
                      backgroundColor: index === 0 ? 'var(--primary)' : index === 1 ? 'var(--accent)' : 'var(--success)',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {formatCurrency(method.amount)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                    +{method.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Trainers */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '1rem',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
            เทรนเนอร์ยอดนิยม
          </h3>
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}>
            ดูทั้งหมด
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                  เทรนเนอร์
                </th>
                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>
                  รายได้
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                  เซสชั่น
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                  ลูกค้า
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                  การเติบโต
                </th>
              </tr>
            </thead>
            <tbody>
              {financialData.topTrainers.map((trainer, index) => (
                <tr key={trainer.id} style={{
                  borderBottom: index < financialData.topTrainers.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        backgroundColor: index === 0 ? 'var(--accent)' : index === 1 ? 'var(--primary)' : 'var(--success)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {index + 1}
                      </div>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {trainer.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>
                    {formatCurrency(trainer.revenue)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {trainer.sessions}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {trainer.clients}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      <TrendingUp size={14} style={{ color: 'var(--success)' }} />
                      <span style={{ fontSize: '0.875rem', color: 'var(--success)' }}>
                        +{trainer.growth}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Analytics Tab
  const renderAnalytics = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Filter Controls */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '1rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: windowWidth <= 768 ? '1fr' : 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              ช่วงเวลา
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: 'var(--bg-secondary)'
              }}
            >
              <option value="today">วันนี้</option>
              <option value="this-week">สัปดาห์นี้</option>
              <option value="this-month">เดือนนี้</option>
              <option value="last-month">เดือนที่แล้ว</option>
              <option value="this-quarter">ไตรมาสนี้</option>
              <option value="this-year">ปีนี้</option>
              <option value="custom">กำหนดเอง</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              เทรนเนอร์
            </label>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: 'var(--bg-secondary)'
              }}
            >
              <option value="all">ทั้งหมด</option>
              {financialData.topTrainers.map(trainer => (
                <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              รูปแบบ
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <Download size={16} />
                ส่งออก
              </button>
              <button style={{
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}>
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Analysis */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '1rem',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
            การกระจายตามภูมิภาค
          </h3>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {financialData.geographicData.map((region, index) => (
              <div key={region.region} style={{
                padding: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {region.region}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {formatCurrency(region.revenue)}
                  </span>
                </div>
                
                <div style={{
                  height: '8px',
                  backgroundColor: 'var(--border-color)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '0.5rem'
                }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${region.percentage}%`,
                      backgroundColor: 'var(--accent)',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {region.trainers} เทรนเนอร์
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--accent)' }}>
                    {region.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>
            📊 รายงานการเงิน
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            วิเคราะห์ผลการดำเนินงานและรายได้
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <option value="today">วันนี้</option>
            <option value="this-week">สัปดาห์นี้</option>
            <option value="this-month">เดือนนี้</option>
            <option value="last-month">เดือนที่แล้ว</option>
            <option value="this-quarter">ไตรมาสนี้</option>
            <option value="this-year">ปีนี้</option>
          </select>
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Download size={16} />
            ส่งออกรายงาน
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'ภาพรวม', icon: BarChart3 },
            { id: 'analytics', label: 'การวิเคราะห์', icon: PieChart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 0',
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default FinancialReportingDashboard;