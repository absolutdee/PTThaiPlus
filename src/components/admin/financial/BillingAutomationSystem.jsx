import React, { useState, useEffect } from 'react';
import {
  Settings, Play, Pause, Calendar, Clock, CheckCircle, 
  AlertTriangle, RefreshCw, BarChart3, Mail, Bell, 
  FileText, CreditCard, Users, TrendingUp, Eye, Edit3,
  Trash2, Plus, Download, Activity, Zap, Bot
} from 'lucide-react';

const BillingAutomationSystem = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState('automation');
  const [automationEnabled, setAutomationEnabled] = useState(true);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Automation rules data
  const automationRules = [
    {
      id: 'billing-monthly',
      name: 'สร้างใบแจ้งหนี้รายเดือน',
      description: 'สร้างใบแจ้งหนี้สำหรับเทรนเนอร์ทุกคนในวันที่ 25 ของทุกเดือน',
      schedule: 'รายเดือน วันที่ 25 เวลา 09:00',
      lastRun: '2024-06-25 09:00:15',
      nextRun: '2024-07-25 09:00:00',
      status: 'active',
      executionTime: '2.5 นาที',
      processedCount: 253,
      type: 'billing'
    },
    {
      id: 'payment-reminder',
      name: 'ส่งการแจ้งเตือนการชำระเงิน',
      description: 'ส่งอีเมลแจ้งเตือนให้เทรนเนอร์ที่ยังไม่ชำระค่าบริการ',
      schedule: 'ทุกวัน เวลา 10:00',
      lastRun: '2024-06-26 10:00:08',
      nextRun: '2024-06-27 10:00:00',
      status: 'active',
      executionTime: '45 วินาที',
      processedCount: 18,
      type: 'notification'
    },
    {
      id: 'overdue-suspension',
      name: 'ระงับบัญชีที่ค้างชำระเกิน 30 วัน',
      description: 'ระงับบัญชีเทรนเนอร์ที่ค้างชำระเกิน 30 วันอัตโนมัติ',
      schedule: 'ทุกวัน เวลา 11:00',
      lastRun: '2024-06-26 11:00:25',
      nextRun: '2024-06-27 11:00:00',
      status: 'active',
      executionTime: '12 วินาที',
      processedCount: 2,
      type: 'suspension'
    },
    {
      id: 'financial-reports',
      name: 'สร้างรายงานการเงินอัตโนมัติ',
      description: 'สร้างรายงานรายวัน รายสัปดาห์ และรายเดือน',
      schedule: 'ทุกวัน เวลา 23:00',
      lastRun: '2024-06-25 23:00:45',
      nextRun: '2024-06-26 23:00:00',
      status: 'active',
      executionTime: '67 วินาที',
      processedCount: 1,
      type: 'report'
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'billing',
      action: 'สร้างใบแจ้งหนี้',
      description: 'สร้างใบแจ้งหนี้รายเดือนสำหรับ 253 เทรนเนอร์',
      timestamp: '2024-06-25 09:00:15',
      status: 'success',
      details: { count: 253, totalAmount: 425000 }
    },
    {
      id: 2,
      type: 'suspension',
      action: 'ระงับบัญชี',
      description: 'ระงับบัญชี "โค้ชแอนน์" เนื่องจากค้างชำระ 32 วัน',
      timestamp: '2024-06-26 11:00:25',
      status: 'warning',
      details: { trainerId: 'TR002', daysOverdue: 32, amount: 8750 }
    },
    {
      id: 3,
      type: 'payment',
      action: 'ยืนยันการชำระ',
      description: 'โค้ชแมท ชำระค่าบริการ ฿11,560',
      timestamp: '2024-06-26 14:30:12',
      status: 'success',
      details: { trainerId: 'TR003', amount: 11560 }
    },
    {
      id: 4,
      type: 'reminder',
      action: 'ส่งอีเมลแจ้งเตือน',
      description: 'ส่งอีเมลแจ้งเตือนการชำระให้ 18 เทรนเนอร์',
      timestamp: '2024-06-26 10:00:08',
      status: 'info',
      details: { count: 18 }
    },
    {
      id: 5,
      type: 'reactivation',
      action: 'เปิดใช้งานบัญชี',
      description: 'เปิดใช้งาน "โค้ชมิกซ์" หลังยืนยันการชำระ',
      timestamp: '2024-06-25 16:45:33',
      status: 'success',
      details: { trainerId: 'TR003', amount: 16320 }
    }
  ];

  // Statistics
  const automationStats = {
    totalExecutions: 1847,
    successRate: 98.7,
    averageExecutionTime: '1.2 นาที',
    timeSaved: '127 ชั่วโมง',
    automatedInvoices: 253,
    automatedReminders: 146,
    automatedSuspensions: 8,
    revenueProcessed: 2450000
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'billing': return FileText;
      case 'notification': return Mail;
      case 'suspension': return AlertTriangle;
      case 'report': return BarChart3;
      case 'payment': return CreditCard;
      case 'reactivation': return CheckCircle;
      default: return Activity;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'billing': return 'var(--primary)';
      case 'notification': return 'var(--info)';
      case 'suspension': return 'var(--danger)';
      case 'report': return 'var(--success)';
      case 'payment': return 'var(--success)';
      case 'reactivation': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success)';
      case 'paused': return 'var(--warning)';
      case 'error': return 'var(--danger)';
      case 'success': return 'var(--success)';
      case 'warning': return 'var(--warning)';
      case 'info': return 'var(--info)';
      default: return 'var(--text-muted)';
    }
  };

  const formatCurrency = (amount) => `฿${amount.toLocaleString()}`;

  // Render Automation Tab
  const renderAutomation = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Control Panel */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '1rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
            ระบบอัตโนมัติ
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            จัดการกระบวนการเรียกเก็บเงินและการแจ้งเตือนอัตโนมัติ
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>สถานะ:</span>
            <span style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: automationEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
              color: automationEnabled ? 'var(--success)' : 'var(--text-muted)',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {automationEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
            </span>
          </div>
          <button
            onClick={() => setAutomationEnabled(!automationEnabled)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: automationEnabled ? 'var(--danger)' : 'var(--success)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {automationEnabled ? <Pause size={16} /> : <Play size={16} />}
            {automationEnabled ? 'หยุดระบบ' : 'เริ่มระบบ'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
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
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <Bot size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {automationStats.totalExecutions}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            การดำเนินการทั้งหมด
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <CheckCircle size={24} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {automationStats.successRate}%
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            อัตราความสำเร็จ
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <Clock size={24} style={{ color: 'var(--info)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {automationStats.timeSaved}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            เวลาที่ประหยัด
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <TrendingUp size={24} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {formatCurrency(automationStats.revenueProcessed)}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            รายได้ที่ประมวลผล
          </div>
        </div>
      </div>

      {/* Automation Rules */}
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
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
            กฎการทำงานอัตโนมัติ
          </h3>
          <button style={{
            padding: '0.75rem 1rem',
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
            <Plus size={16} />
            เพิ่มกฎใหม่
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {automationRules.map((rule, index) => {
              const TypeIcon = getTypeIcon(rule.type);
              return (
                <div key={rule.id} style={{
                  padding: '1.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{
                          padding: '0.5rem',
                          backgroundColor: `color-mix(in srgb, ${getTypeColor(rule.type)} 15%, transparent)`,
                          borderRadius: '0.5rem'
                        }}>
                          <TypeIcon size={16} style={{ color: getTypeColor(rule.type) }} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                          {rule.name}
                        </h4>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: `color-mix(in srgb, ${getStatusColor(rule.status)} 15%, transparent)`,
                          color: getStatusColor(rule.status),
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {rule.status === 'active' ? 'ทำงาน' : 'หยุด'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
                        {rule.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        padding: '0.5rem',
                        backgroundColor: 'var(--info)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}>
                        <Edit3 size={14} />
                      </button>
                      <button style={{
                        padding: '0.5rem',
                        backgroundColor: rule.status === 'active' ? 'var(--warning)' : 'var(--success)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}>
                        {rule.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: windowWidth <= 768 ? '1fr' : 'repeat(2, 1fr)',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ตารางเวลา:</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{rule.schedule}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ทำงานครั้งล่าสุด:</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{rule.lastRun}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ทำงานครั้งถัดไป:</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{rule.nextRun}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>เวลาดำเนินการ:</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{rule.executionTime}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>จำนวนที่ประมวลผล:</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{rule.processedCount} รายการ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Activities Tab
  const renderActivities = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
          กิจกรรมล่าสุด
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Download size={16} />
            ส่งออกข้อมูล
          </button>
          <button style={{
            padding: '0.75rem 1rem',
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
            <RefreshCw size={16} />
            รีเฟรช
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '1rem',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map((activity, index) => {
              const TypeIcon = getTypeIcon(activity.type);
              return (
                <div key={activity.id} style={{
                  padding: '1.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: `color-mix(in srgb, ${getStatusColor(activity.status)} 15%, transparent)`,
                    borderRadius: '0.5rem',
                    flexShrink: 0
                  }}>
                    <TypeIcon size={20} style={{ color: getStatusColor(activity.status) }} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                        {activity.action}
                      </h4>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: `color-mix(in srgb, ${getStatusColor(activity.status)} 15%, transparent)`,
                        color: getStatusColor(activity.status),
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {activity.status === 'success' ? 'สำเร็จ' : 
                         activity.status === 'warning' ? 'เตือน' : 
                         activity.status === 'info' ? 'ข้อมูล' : activity.status}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
                      {activity.description}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {activity.timestamp}
                      </div>
                      
                      {activity.details && (
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                          {activity.details.count && (
                            <span style={{ color: 'var(--text-secondary)' }}>
                              จำนวน: {activity.details.count}
                            </span>
                          )}
                          {activity.details.amount && (
                            <span style={{ color: 'var(--text-secondary)' }}>
                              จำนวนเงิน: {formatCurrency(activity.details.amount)}
                            </span>
                          )}
                          {activity.details.totalAmount && (
                            <span style={{ color: 'var(--text-secondary)' }}>
                              รวม: {formatCurrency(activity.details.totalAmount)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Navigation Tabs */}
      <div style={{
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto' }}>
          {[
            { id: 'automation', label: 'ระบบอัตโนมัติ', icon: Bot },
            { id: 'activities', label: 'กิจกรรมล่าสุด', icon: Activity }
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
      {activeTab === 'automation' && renderAutomation()}
      {activeTab === 'activities' && renderActivities()}
    </div>
  );
};

export default BillingAutomationSystem;