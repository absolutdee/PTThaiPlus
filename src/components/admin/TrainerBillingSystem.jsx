import React, { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, Users, AlertTriangle, CheckCircle, 
  Clock, Eye, Edit3, Trash2, Download, Search, Filter, 
  Calendar, ChevronDown, ChevronUp, MoreVertical, Mail,
  Phone, CreditCard, Building2, Pause, Play, FileText,
  LayoutDashboard
} from 'lucide-react';

const TrainerBillingSystem = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [editingTrainer, setEditingTrainer] = useState(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data
  const trainersData = [
    {
      id: 'TR001',
      name: 'โค้ชแมท',
      email: 'matt@example.com',
      phone: '081-234-5678',
      registrationDate: '2024-01-15',
      status: 'active',
      currentBalance: -12500,
      totalRevenue: 125000,
      sessionsCompleted: 45,
      serviceFeeRate: 0.10,
      paymentMethod: 'bank_transfer',
      lastPayment: '2024-06-15',
      nextBillingDate: '2024-07-25'
    },
    {
      id: 'TR002',
      name: 'โค้ชแอนน์',
      email: 'ann@example.com',
      phone: '082-345-6789',
      registrationDate: '2024-02-20',
      status: 'suspended',
      currentBalance: -8750,
      totalRevenue: 87500,
      sessionsCompleted: 32,
      serviceFeeRate: 0.10,
      paymentMethod: 'promptpay',
      lastPayment: '2024-05-10',
      nextBillingDate: '2024-07-25'
    },
    {
      id: 'TR003',
      name: 'โค้ชมิกซ์',
      email: 'mix@example.com',
      phone: '083-456-7890',
      registrationDate: '2024-03-10',
      status: 'active',
      currentBalance: 2500,
      totalRevenue: 96000,
      sessionsCompleted: 38,
      serviceFeeRate: 0.10,
      paymentMethod: 'bank_transfer',
      lastPayment: '2024-06-20',
      nextBillingDate: '2024-07-25'
    },
    {
      id: 'TR004',
      name: 'โค้ชจิม',
      email: 'jim@example.com',
      phone: '084-567-8901',
      registrationDate: '2024-04-05',
      status: 'pending',
      currentBalance: -15600,
      totalRevenue: 156000,
      sessionsCompleted: 52,
      serviceFeeRate: 0.10,
      paymentMethod: 'credit_card',
      lastPayment: '2024-06-01',
      nextBillingDate: '2024-07-25'
    }
  ];

  const invoicesData = [
    {
      id: 'INV-2024-06-001',
      trainerId: 'TR001',
      trainerName: 'โค้ชแมท',
      period: 'มิถุนายน 2024',
      issueDate: '2024-06-25',
      dueDate: '2024-07-10',
      status: 'paid',
      totalRevenue: 125000,
      serviceFee: 12500,
      vat: 8750,
      netAmount: 21250,
      paymentDate: '2024-07-08'
    },
    {
      id: 'INV-2024-06-002',
      trainerId: 'TR002',
      trainerName: 'โค้ชแอนน์',
      period: 'มิถุนายน 2024',
      issueDate: '2024-06-25',
      dueDate: '2024-07-10',
      status: 'overdue',
      totalRevenue: 87500,
      serviceFee: 8750,
      vat: 6125,
      netAmount: 14875,
      daysOverdue: 16
    },
    {
      id: 'INV-2024-06-003',
      trainerId: 'TR003',
      trainerName: 'โค้ชมิกซ์',
      period: 'มิถุนายน 2024',
      issueDate: '2024-06-25',
      dueDate: '2024-07-10',
      status: 'paid',
      totalRevenue: 96000,
      serviceFee: 9600,
      vat: 6720,
      netAmount: 16320,
      paymentDate: '2024-07-05'
    }
  ];

  // Calculate summary statistics
  const summaryStats = {
    totalTrainers: trainersData.length,
    activeTrainers: trainersData.filter(t => t.status === 'active').length,
    suspendedTrainers: trainersData.filter(t => t.status === 'suspended').length,
    totalOutstanding: trainersData.reduce((sum, t) => sum + Math.abs(Math.min(t.currentBalance, 0)), 0),
    totalRevenue: invoicesData.reduce((sum, inv) => sum + inv.totalRevenue, 0),
    totalFees: invoicesData.reduce((sum, inv) => sum + inv.serviceFee + inv.vat, 0),
    overdueInvoices: invoicesData.filter(inv => inv.status === 'overdue').length,
    paidInvoices: invoicesData.filter(inv => inv.status === 'paid').length
  };

  const formatCurrency = (amount) => `฿${amount.toLocaleString()}`;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success)';
      case 'suspended': return 'var(--danger)';
      case 'pending': return 'var(--warning)';
      case 'paid': return 'var(--success)';
      case 'overdue': return 'var(--danger)';
      case 'processing': return 'var(--info)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'ใช้งานได้';
      case 'suspended': return 'ถูกระงับ';
      case 'pending': return 'รอดำเนินการ';
      case 'paid': return 'ชำระแล้ว';
      case 'overdue': return 'เกินกำหนด';
      case 'processing': return 'กำลังดำเนินการ';
      default: return status;
    }
  };

  const handleSuspendTrainer = (trainerId) => {
    setSelectedTrainer(trainersData.find(t => t.id === trainerId));
    setShowSuspendModal(true);
  };

  const handleEditTrainer = (trainerId) => {
    setEditingTrainer(trainersData.find(t => t.id === trainerId));
    setShowEditModal(true);
  };

  const handleViewInvoice = (invoice) => {
    setExpandedInvoice(expandedInvoice === invoice.id ? null : invoice.id);
  };

  // Render Overview Tab
  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* สถิติรวม */}
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
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>เทรนเนอร์ทั้งหมด</span>
            <Users size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {summaryStats.totalTrainers}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
            ใช้งานได้ {summaryStats.activeTrainers} คน
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>รายได้รวม</span>
            <DollarSign size={20} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {formatCurrency(summaryStats.totalRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
            +12.5% จากเดือนที่แล้ว
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ค่าบริการรวม</span>
            <TrendingUp size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {formatCurrency(summaryStats.totalFees)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
            +8.3% จากเดือนที่แล้ว
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ค้างชำระ</span>
            <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {formatCurrency(summaryStats.totalOutstanding)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
            {summaryStats.overdueInvoices} ใบแจ้งหนี้
          </div>
        </div>
      </div>

      {/* ตารางเทรนเนอร์ */}
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
            จัดการเทรนเนอร์
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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

        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: windowWidth <= 768 ? '1fr' : '1fr auto auto',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                placeholder="ค้นหาเทรนเนอร์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="active">ใช้งานได้</option>
              <option value="suspended">ถูกระงับ</option>
              <option value="pending">รอดำเนินการ</option>
            </select>

            <button style={{
              padding: '0.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--bg-secondary)',
              cursor: 'pointer'
            }}>
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  เทรนเนอร์
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  สถานะ
                </th>
                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  ยอดค้าง
                </th>
                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  รายได้รวม
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {trainersData.map((trainer, index) => (
                <tr key={trainer.id} style={{
                  borderBottom: index < trainersData.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {trainer.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {trainer.email}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: `color-mix(in srgb, ${getStatusColor(trainer.status)} 15%, transparent)`,
                      color: getStatusColor(trainer.status),
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {getStatusText(trainer.status)}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '1rem', 
                    textAlign: 'right',
                    color: trainer.currentBalance < 0 ? 'var(--danger)' : 'var(--success)',
                    fontWeight: '500'
                  }}>
                    {formatCurrency(Math.abs(trainer.currentBalance))}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>
                    {formatCurrency(trainer.totalRevenue)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEditTrainer(trainer.id)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: 'var(--info)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                      {trainer.status === 'active' ? (
                        <button
                          onClick={() => handleSuspendTrainer(trainer.id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'var(--danger)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Pause size={14} />
                        </button>
                      ) : (
                        <button
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'var(--success)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Play size={14} />
                        </button>
                      )}
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

  // Render Invoices Tab
  const renderInvoices = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
          ใบแจ้งหนี้
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
            <FileText size={16} />
            สร้างใบแจ้งหนี้
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '1rem',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        {invoicesData.map((invoice, index) => (
          <div key={invoice.id} style={{
            borderBottom: index < invoicesData.length - 1 ? '1px solid var(--border-color)' : 'none'
          }}>
            <div
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: invoice.status === 'overdue' ? 
                  'rgba(239, 68, 68, 0.05)' : 'transparent'
              }}
              onClick={() => handleViewInvoice(invoice)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {invoice.id}
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: `color-mix(in srgb, ${getStatusColor(invoice.status)} 15%, transparent)`,
                    color: getStatusColor(invoice.status),
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {getStatusText(invoice.status)}
                  </span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {invoice.trainerName} • {invoice.period}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {formatCurrency(invoice.netAmount)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  ครบกำหนด: {invoice.dueDate}
                </div>
              </div>
              <div style={{ marginLeft: '1rem' }}>
                {expandedInvoice === invoice.id ? 
                  <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} /> :
                  <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />
                }
              </div>
            </div>

            {expandedInvoice === invoice.id && (
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: windowWidth <= 768 ? '1fr' : 'repeat(2, 1fr)',
                  gap: '1.5rem'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      รายละเอียดการเรียกเก็บ
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>รายได้รวม:</span>
                        <span style={{ fontWeight: '500' }}>{formatCurrency(invoice.totalRevenue)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>ค่าบริการ (10%):</span>
                        <span style={{ fontWeight: '500' }}>{formatCurrency(invoice.serviceFee)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>ภาษีมูลค่าเพิ่ม (7%):</span>
                        <span style={{ fontWeight: '500' }}>{formatCurrency(invoice.vat)}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '0.5rem',
                        borderTop: '1px solid var(--border-color)',
                        fontWeight: '600'
                      }}>
                        <span>ยอดรวม:</span>
                        <span>{formatCurrency(invoice.netAmount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      ข้อมูลการชำระ
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>วันที่ออกใบแจ้งหนี้:</span>
                        <span>{invoice.issueDate}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>วันครบกำหนด:</span>
                        <span>{invoice.dueDate}</span>
                      </div>
                      {invoice.paymentDate && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>วันที่ชำระ:</span>
                          <span style={{ color: 'var(--success)' }}>{invoice.paymentDate}</span>
                        </div>
                      )}
                      {invoice.daysOverdue && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>เกินกำหนด:</span>
                          <span style={{ color: 'var(--danger)' }}>{invoice.daysOverdue} วัน</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
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
            { id: 'overview', label: 'ภาพรวม', icon: LayoutDashboard },
            { id: 'invoices', label: 'ใบแจ้งหนี้', icon: FileText }
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
      {activeTab === 'invoices' && renderInvoices()}
    </div>
  );
};

export default TrainerBillingSystem;