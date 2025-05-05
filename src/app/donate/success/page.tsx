'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { FaCheckCircle, FaArrowLeft, FaHeart } from 'react-icons/fa';

// 为 Google Analytics 定义类型
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: object) => void;
  }
}

export default function DonateSuccessPage() {
  const [countdown, setCountdown] = useState(5);

  // 追踪成功支付转化
  useEffect(() => {
    // 尝试触发Google Analytics追踪事件（如果存在）
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'donation_completed', {
          event_category: 'donations',
          event_label: 'Donation Success',
          value: 1
        });
      }
    } catch (e) {
      console.error('Analytics tracking error:', e);
    }
  }, []);

  // 设置5秒后自动返回首页
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-md py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Thank You!
          </h1>
          <div className="flex justify-center items-center mb-4">
            <FaHeart className="text-red-500 text-xl mx-1 animate-pulse" />
            <FaHeart className="text-red-500 text-2xl mx-1 animate-pulse" />
            <FaHeart className="text-red-500 text-xl mx-1 animate-pulse" />
          </div>
          <p className="text-gray-600 text-base mb-6">
            Your support will help us continue to improve our services.
          </p>
          
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-block px-6 py-2 bg-amber-500 text-white font-semibold rounded-full hover:bg-amber-600 transition"
            >
              <FaArrowLeft className="inline-block mr-2" />
              Back to Home
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm">
            Redirecting to home in {countdown} seconds...
          </p>
        </div>
      </div>
    </Layout>
  );
} 