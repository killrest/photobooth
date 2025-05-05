import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// 定义处理API请求的函数
export async function POST(req: Request) {
  // 从环境变量安全地获取密钥
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const domain = process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://freephotobooth.app';
  
  // 检查密钥是否存在
  if (!stripeSecretKey) {
    console.error('[Stripe] Missing Stripe secret key in environment variables');
    return NextResponse.json(
      { error: 'Stripe service configuration error' },
      { status: 500 }
    );
  }
  
  // 创建Stripe实例
  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    });

    // 解析请求体
    let amount, priceId;
    try {
      const body = await req.json();
      amount = body.amount;
      priceId = body.priceId;
    } catch (error) {
      console.error('[Stripe] Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    // 设置成功和取消URL
    const successUrl = `${domain}/donate/success`;
    const cancelUrl = `${domain}/donate?canceled=true`;
    
    // 验证金额
    if (!amount || amount < 1) {
      console.error(`[Stripe] Invalid amount provided: ${amount}`);
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    // 创建价格（或使用预先创建的价格）
    const unitAmount = Math.round(amount * 100); // 转换为分为单位
    
    // 创建Checkout会话
    const isTestMode = stripeSecretKey.startsWith('sk_test_');
    console.log(`[Stripe] Creating ${isTestMode ? 'TEST' : 'LIVE'} session for amount $${amount}`);
    
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Support $${amount}`,
                description: 'Thank you for supporting our free photo booth service!'
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          source: 'freephotobooth.app',
          amount: amount.toString()
        }
      });

      console.log(`[Stripe] Session created successfully: ${session.id}`);
      return NextResponse.json({ url: session.url });
    } catch (stripeError) {
      console.error('[Stripe] Error creating checkout session:', stripeError);
      return NextResponse.json(
        { error: 'Payment initialization failed, please try again later' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Stripe] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed, please try again later' },
      { status: 500 }
    );
  }
} 