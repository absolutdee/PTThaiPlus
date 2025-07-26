// src/components/payment/PaymentModal.jsx
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, QrCode, Loader } from 'lucide-react';
import { usePayment } from '../../contexts/PaymentContext';
import { useNotification } from '../../contexts/NotificationContext';

const PaymentModal = ({ isOpen, onClose, package: selectedPackage, trainer }) => {
  const { createPaymentIntent, processPayment, isLoading } = usePayment();
  const { showSuccess, showError } = useNotification();
  
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'บัตรเครดิต/เดบิต',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB'
    },
    {
      id: 'promptpay',
      name: 'PromptPay',
      icon: Smartphone,
      description: 'สแกน QR Code เพื่อชำระ'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: QrCode,
      description: 'ธนาคารต่างๆ'
    }
  ];

  const handlePayment = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent(
        selectedPackage.price * 100, // Convert to cents
        'thb',
        {
          packageId: selectedPackage.id,
          trainerId: trainer.id,
          method: selectedMethod
        }
      );

      // Process payment based on selected method
      let result;
      switch (selectedMethod) {
        case 'card':
          result = await processCardPayment(paymentIntent);
          break;
        case 'promptpay':
          result = await processPromptPayPayment(paymentIntent);
          break;
        case 'qr':
          result = await processQRPayment(paymentIntent);
          break;
        default:
          throw new Error('วิธีการชำระเงินไม่ถูกต้อง');
      }

      if (result.status === 'succeeded') {
        showSuccess('ชำระเงินสำเร็จ! เราจะติดต่อกลับภายใน 24 ชั่วโมง');
        onClose();
      }
    } catch (error) {
      showError(error.message || 'เกิดข้อผิดพลาดในการชำระเงิน');
    } finally {
      setIsProcessing(false);
    }
  };

  const processCardPayment = async (paymentIntent) => {
    // Integration with Stripe or other payment processor
    return await processPayment('card', paymentIntent.id);
  };

  const processPromptPayPayment = async (paymentIntent) => {
    // Generate PromptPay QR Code
    return await processPayment('promptpay', paymentIntent.id);
  };

  const processQRPayment = async (paymentIntent) => {
    // Generate bank QR Code
    return await processPayment('qr', paymentIntent.id);
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">ชำระเงิน</h5>
            <button type="button" className="btn-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            {/* Package Summary */}
            <div className="card mb-4">
              <div className="card-body">
                <h6 className="card-title">รายละเอียดแพคเกจ</h6>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5>{selectedPackage?.name}</h5>
                    <p className="text-muted mb-2">{selectedPackage?.description}</p>
                    <small className="text-muted">เทรนเนอร์: {trainer?.name}</small>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="h4 text-primary mb-0">
                      ฿{selectedPackage?.price?.toLocaleString()}
                    </div>
                    <small className="text-muted">
                      {selectedPackage?.sessions} เซสชั่น
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-4">
              <h6 className="mb-3">เลือกวิธีการชำระเงิน</h6>
              <div className="row g-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="col-md-4">
                    <div
                      className={`card h-100 cursor-pointer ${
                        selectedMethod === method.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="card-body text-center">
                        <method.icon 
                          size={32} 
                          className={`mb-2 ${
                            selectedMethod === method.id ? 'text-primary' : 'text-muted'
                          }`} 
                        />
                        <h6 className="card-title">{method.name}</h6>
                        <small className="text-muted">{method.description}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            {selectedMethod === 'card' && (
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title mb-3">ข้อมูลบัตร</h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">หมายเลขบัตร</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.number}
                        onChange={(e) => setCardData(prev => ({
                          ...prev,
                          number: e.target.value
                        }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">วันหมดอายุ</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData(prev => ({
                          ...prev,
                          expiry: e.target.value
                        }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">CVC</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="123"
                        value={cardData.cvc}
                        onChange={(e) => setCardData(prev => ({
                          ...prev,
                          cvc: e.target.value
                        }))}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">ชื่อผู้ถือบัตร</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ชื่อบนบัตร"
                        value={cardData.name}
                        onChange={(e) => setCardData(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(selectedMethod === 'promptpay' || selectedMethod === 'qr') && (
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <div 
                      className="bg-light mx-auto d-flex align-items-center justify-content-center"
                      style={{ width: '200px', height: '200px' }}
                    >
                      <QrCode size={48} className="text-muted" />
                      <div className="ms-2 text-muted">QR Code</div>
                    </div>
                  </div>
                  <p className="text-muted">
                    สแกน QR Code ด้วยแอปธนาคารหรือแอป PromptPay
                  </p>
                  <div className="h5 text-primary">
                    ฿{selectedPackage?.price?.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePayment}
              disabled={isProcessing || isLoading}
            >
              {isProcessing || isLoading ? (
                <>
                  <Loader size={16} className="me-2" style={{ animation: 'spin 1s linear infinite' }} />
                  กำลังดำเนินการ...
                </>
              ) : (
                `ชำระเงิน ฿${selectedPackage?.price?.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
