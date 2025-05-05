'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';
import Layout from '../components/Layout';
import { FaArrowLeft, FaRegSmile, FaHeart } from 'react-icons/fa';

// 确保在浏览器环境中获取公钥
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

// 定义金额选项
const priceOptions = [
  { id: 'price_basic', amount: 5, label: 'Coffee', emoji: '☕️' },
  { id: 'price_standard', amount: 10, label: 'Lunch', emoji: '🍱' },
  { id: 'price_premium', amount: 15, label: 'Dinner', emoji: '🍲' },
  { id: 'price_custom', amount: null, label: 'Custom', emoji: '💖' },
];

export default function DonatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(priceOptions[0].id);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 处理 Stripe Checkout 重定向
  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 获取所选金额
      let amount = 0;
      
      if (selectedPrice === 'price_custom') {
        if (!customAmount || customAmount < 1) {
          setErrorMessage('Please enter a valid amount (minimum $1)');
          setIsLoading(false);
          return;
        }
        amount = customAmount;
      } else {
        const selectedOption = priceOptions.find(option => option.id === selectedPrice);
        if (selectedOption && selectedOption.amount) {
          amount = selectedOption.amount;
        }
      }

      // 调用后端API创建Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 将选择的金额传递给后端，后端将使用此金额创建价格
          amount: amount,
        }),
      });

      const { url } = await response.json();
      
      // 重定向到Stripe Checkout页面
      window.location.href = url || '';
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setErrorMessage('Payment page creation failed, please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-md py-4">
        <Link href="/" className="flex items-center text-amber-600 hover:text-amber-800 mb-4">
          <FaArrowLeft className="mr-2" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Support Us</h1>
            <p className="text-gray-600 text-sm">
              Your support helps us continue providing free services!
              <FaHeart className="inline-block ml-1 text-red-500" />
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Choose Amount</h2>
              <div className="grid grid-cols-2 gap-3">
                {priceOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedPrice(option.id);
                      if (option.id !== 'price_custom') {
                        setCustomAmount(null);
                      }
                    }}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all
                      ${selectedPrice === option.id 
                        ? 'border-amber-500 bg-amber-50' 
                        : 'border-gray-200 hover:border-amber-200 hover:bg-amber-50/30'}`}
                  >
                    <span className="text-xl mb-1">{option.emoji}</span>
                    <span className="font-medium text-sm">{option.label}</span>
                    {option.amount !== null && (
                      <span className="text-amber-600 font-bold mt-1">${option.amount}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedPrice === 'price_custom' && (
              <div className="my-2">
                <label htmlFor="custom-amount" className="block text-gray-700 mb-1 text-sm">
                  Enter Amount ($)
                </label>
                <input
                  id="custom-amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter custom amount"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  value={customAmount || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setCustomAmount(isNaN(value) ? null : value);
                  }}
                />
              </div>
            )}

            {errorMessage && (
              <div className="my-2 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isLoading || (selectedPrice === 'price_custom' && !customAmount)}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-base transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Support Now'}
            </button>

            <div className="text-center text-gray-500 text-xs mt-2">
              <p>Your payment will be securely processed by Stripe</p>
              <p className="mt-1 flex items-center justify-center">
                <FaRegSmile className="mr-1" />
                Thank you for your support!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 