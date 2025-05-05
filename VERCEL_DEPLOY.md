# Vercel 部署指南

本文档指导您如何将Yoyobooth项目部署到Vercel，并配置正确的环境变量以支持Stripe支付功能。

## 步骤 1: 准备GitHub仓库

1. 将代码推送到GitHub:
   ```bash
   git add .
   git commit -m "准备部署到生产环境"
   git push origin main
   ```

## 步骤 2: 在Vercel上设置项目

1. 登录 [Vercel](https://vercel.com/)
2. 点击 "New Project"
3. 导入您的GitHub仓库
4. 选择项目并点击 "Import"

## 步骤 3: 配置环境变量

在项目设置页面中，找到 "Environment Variables" 部分并添加以下变量:

1. `STRIPE_SECRET_KEY` - 您的Stripe密钥
   - 测试环境使用 `sk_test_` 开头的密钥
   - 生产环境使用 `sk_live_` 开头的密钥

2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - 您的Stripe可发布密钥
   - 测试环境使用 `pk_test_` 开头的密钥
   - 生产环境使用 `pk_live_` 开头的密钥

3. `NEXT_PUBLIC_DOMAIN_URL` - 您的域名
   - 设置为 `https://freephotobooth.app`

## 步骤 4: 部署设置

1. 构建命令: `next build` (默认)
2. 输出目录: `.next` (默认)
3. 确保选择Node.js版本18或更高

## 步骤 5: 配置自定义域名

1. 在项目设置中找到 "Domains" 部分
2. 添加您的域名 `freephotobooth.app`
3. 按照Vercel提供的说明更新您的DNS设置

## 步骤 6: 部署

1. 点击 "Deploy" 按钮
2. 等待部署完成
3. 访问您的网站并测试Stripe支付功能

## 测试Stripe支付

1. 使用测试卡号: `4242 4242 4242 4242`
2. 任意有效期(未来日期)
3. 任意CVC
4. 任意邮编

## 重要注意事项

- 确保所有环境变量都已正确设置
- 在上线前，将Stripe账户从测试模式切换到生产模式
- 如果使用生产模式的Stripe，确保更新密钥为生产版本
- 部署后访问网站并确保打赏功能正常工作 