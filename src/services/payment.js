// src/services/payment.js
import ApiService from './api';

class PaymentService {
  constructor() {
    this.API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.STRIPE_PK = process.env.REACT_APP_STRIPE_PK;
  }

  // Create payment intent
  async createPaymentIntent(paymentData) {
    try {
      const response = await ApiService.post('/payment/create-intent', paymentData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การสร้าง Payment Intent ล้มเหลว');
    }
  }

  // Confirm payment
  async confirmPayment(paymentData) {
    try {
      const response = await ApiService.post('/payment/confirm', paymentData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การชำระเงินล้มเหลว');
    }
  }

  // Process PromptPay payment
  async processPromptPayPayment(paymentData) {
    try {
      const response = await ApiService.post('/payment/promptpay', paymentData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การชำระเงินผ่าน PromptPay ล้มเหลว');
    }
  }

  // Get payment methods
  async getPaymentMethods(userId) {
    try {
      const response = await ApiService.get(`/payment/methods/${userId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การดึงข้อมูลวิธีการชำระเงินล้มเหลว');
    }
  }

  // Add payment method
  async addPaymentMethod(paymentMethodData) {
    try {
      const response = await ApiService.post('/payment/methods', paymentMethodData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การเพิ่มวิธีการชำระเงินล้มเหลว');
    }
  }

  // Remove payment method
  async removePaymentMethod(paymentMethodId) {
    try {
      const response = await ApiService.delete(`/payment/methods/${paymentMethodId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การลบวิธีการชำระเงินล้มเหลว');
    }
  }

  // Get transaction history
  async getTransactionHistory(userId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await ApiService.get(
        `/payment/transactions/${userId}?${queryString}`
      );
      return response;
    } catch (error) {
      throw new Error(error.message || 'การดึงประวัติการชำระเงินล้มเหลว');
    }
  }

  // Get transaction details
  async getTransactionDetails(transactionId) {
    try {
      const response = await ApiService.get(`/payment/transactions/details/${transactionId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การดึงรายละเอียดธุรกรรมล้มเหลว');
    }
  }

  // Request refund
  async requestRefund(refundData) {
    try {
      const response = await ApiService.post('/payment/refund', refundData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การขอคืนเงินล้มเหลว');
    }
  }

  // Generate invoice
  async generateInvoice(invoiceData) {
    try {
      const response = await ApiService.post('/payment/invoice', invoiceData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การสร้างใบแจ้งหนี้ล้มเหลว');
    }
  }

  // Verify payment status
  async verifyPaymentStatus(paymentIntentId) {
    try {
      const response = await ApiService.get(`/payment/verify/${paymentIntentId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'การตรวจสอบสถานะการชำระเงินล้มเหลว');
    }
  }
}

export const paymentService = new PaymentService();
