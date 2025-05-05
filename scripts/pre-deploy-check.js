#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 在推送到GitHub/部署到Vercel前运行此脚本确保一切就绪
 * 
 * 运行方式: node scripts/pre-deploy-check.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 运行部署前检查...\n');

// 检查是否有未提交的变更
try {
  const status = execSync('git status --porcelain').toString();
  if (status.length > 0) {
    console.log('⚠️  警告: 有未提交的变更');
    console.log(status);
    console.log('建议: 提交所有变更后再部署\n');
  } else {
    console.log('✅ 所有变更已提交到Git\n');
  }
} catch (error) {
  console.log('❌ 无法检查Git状态:', error.message);
}

// 检查是否存在环境变量文件，并检查内容
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('⚠️  找到本地环境变量文件 (.env.local)');
    
    // 检查Stripe密钥
    if (envContent.includes('sk_test_')) {
      console.log('⚠️  警告: 使用的是测试模式Stripe密钥');
      console.log('提示: 在生产环境中应使用sk_live_开头的密钥\n');
    }
    
    // 检查域名
    if (envContent.includes('localhost')) {
      console.log('⚠️  警告: 域名设置为localhost');
      console.log('提示: 在生产环境中应使用您的实际域名\n');
    }
    
    console.log('⚠️  注意: 不要将.env.local文件上传到GitHub\n');
  } else {
    console.log('✅ 未找到本地环境变量文件，将使用Vercel环境变量\n');
  }
} catch (error) {
  console.log('❌ 无法检查环境变量:', error.message);
}

// 检查生产构建是否成功
try {
  console.log('🔨 尝试构建生产版本...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 生产构建成功\n');
} catch (error) {
  console.log('❌ 生产构建失败! 请修复错误后再部署\n');
  process.exit(1);
}

// 最终检查结果
console.log('🎉 预部署检查完成!');
console.log('📋 部署前请确认:');
console.log('  1. 所有代码变更已提交到Git');
console.log('  2. 在Vercel上设置了正确的环境变量');
console.log('  3. 已配置正确的域名 (freephotobooth.app)');
console.log('  4. 已更新Stripe密钥 (生产环境)');
console.log('\n开始部署:');
console.log('  1. 推送到GitHub: git push origin main');
console.log('  2. Vercel将自动部署'); 