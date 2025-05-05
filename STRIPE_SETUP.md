# Stripe打赏功能设置指南

## 1. 创建Stripe账户

如果您还没有Stripe账户，请前往 [Stripe官网](https://stripe.com) 注册一个账户。

## 2. 获取API密钥

登录Stripe账户后，在开发者设置中获取API密钥：

1. 登录Stripe仪表板
2. 前往"开发人员" > "API密钥"
3. 复制"可发布密钥"(Publishable key)和"密钥"(Secret key)

## 3. 配置环境变量

创建一个名为`.env.local`的文件在项目根目录，并添加以下内容：

```
# Stripe API密钥
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# 域名 - 用于Checkout成功/取消URL
NEXT_PUBLIC_DOMAIN_URL=http://localhost:3000
```

将`sk_test_your_stripe_secret_key`替换为您的Stripe密钥，将`pk_test_your_stripe_publishable_key`替换为您的可发布密钥。

在部署到生产环境时，请确保更新`NEXT_PUBLIC_DOMAIN_URL`为您的实际网站域名。

## 4. 配置Stripe Webhook (可选但推荐)

为了处理支付完成后的事件，您可以设置Webhook：

1. 在Stripe仪表板中，前往"开发人员" > "Webhooks"
2. 点击"添加端点"
3. 输入您的Webhook URL，例如：`https://yourdomain.com/api/webhook`
4. 选择要监听的事件，至少包括：`checkout.session.completed`
5. 创建后，复制Webhook密钥并设置为环境变量：

```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 5. 测试支付

在开发环境中，您可以使用Stripe提供的测试卡号进行支付测试：

- 卡号：`4242 4242 4242 4242`
- 有效期：任何未来日期
- CVC：任意3位数字
- 邮编：任意5位数字

## 6. 切换到生产模式

当准备好上线时，请切换到生产模式的API密钥（以`sk_live_`和`pk_live_`开头）。

**重要：永远不要在客户端代码中暴露您的密钥（Secret Key）！** 