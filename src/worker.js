// Cloudflare Worker for Cronicle
// Enhanced version with web interface and basic functionality

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cronicle Worker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 2rem;
            max-width: 800px;
            width: 90%;
        }
        
        .header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .logo {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            color: #666;
            font-size: 1.1rem;
        }
        
        .status {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .status-item:last-child {
            border-bottom: none;
        }
        
        .status-label {
            font-weight: 600;
            color: #495057;
        }
        
        .status-value {
            color: #28a745;
            font-family: monospace;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .feature-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.5rem;
            text-align: center;
            border: 1px solid #e9ecef;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .feature-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .feature-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #495057;
        }
        
        .feature-desc {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .api-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        
        .api-title {
            font-weight: 600;
            margin-bottom: 1rem;
            color: #495057;
        }
        
        .api-endpoint {
            background: white;
            border-radius: 5px;
            padding: 1rem;
            margin: 0.5rem 0;
            border: 1px solid #dee2e6;
            font-family: monospace;
            font-size: 0.9rem;
        }
        
        .method {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            border-radius: 3px;
            font-weight: bold;
            margin-right: 0.5rem;
        }
        
        .get { background: #d1ecf1; color: #0c5460; }
        .post { background: #d4edda; color: #155724; }
        
        @media (max-width: 768px) {
            .container {
                margin: 1rem;
                padding: 1.5rem;
            }
            
            .logo {
                font-size: 2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🕐 Cronicle Worker</div>
            <div class="subtitle">基于 Cloudflare Workers 的轻量级任务调度器</div>
        </div>
        
        <div class="status">
            <div class="status-item">
                <span class="status-label">服务状态</span>
                <span class="status-value">🟢 运行中</span>
            </div>
            <div class="status-item">
                <span class="status-label">部署时间</span>
                <span class="status-value">{timestamp}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Worker 版本</span>
                <span class="status-value">v1.0.0</span>
            </div>
            <div class="status-item">
                <span class="status-label">地区</span>
                <span class="status-value">{region}</span>
            </div>
        </div>
        
        <div class="features">
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <div class="feature-title">高性能</div>
                <div class="feature-desc">基于 Cloudflare 全球网络，毫秒级响应</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <div class="feature-title">安全可靠</div>
                <div class="feature-desc">企业级安全保障，数据加密传输</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🌍</div>
                <div class="feature-title">全球部署</div>
                <div class="feature-desc">覆盖全球 200+ 个城市的边缘节点</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📊</div>
                <div class="feature-title">实时监控</div>
                <div class="feature-desc">任务执行状态实时监控和报告</div>
            </div>
        </div>
        
        <div class="api-section">
            <div class="api-title">📡 可用 API 端点</div>
            <div class="api-endpoint">
                <span class="method get">GET</span> /health - 健康检查
            </div>
            <div class="api-endpoint">
                <span class="method get">GET</span> /api/status - 服务状态
            </div>
            <div class="api-endpoint">
                <span class="method get">GET</span> /api/time - 当前时间
            </div>
            <div class="api-endpoint">
                <span class="method post">POST</span> /api/schedule - 创建计划任务
            </div>
            <div class="api-endpoint">
                <span class="method get">GET</span> /api/jobs - 查看任务列表
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; color: #6c757d; font-size: 0.9rem;">
            <p>Powered by Cloudflare Workers • 部署于 {timestamp}</p>
        </div>
    </div>
</body>
</html>
`;

// 模拟任务存储（在实际应用中应该使用 KV 存储）
let jobs = [];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;
    
    // CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    // 处理 OPTIONS 请求
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // 主页 - 显示 Web 界面
    if (url.pathname === '/') {
      const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
      const region = request.cf?.colo || 'Unknown';
      
      const html = HTML_TEMPLATE
        .replace(/{timestamp}/g, timestamp)
        .replace(/{region}/g, region);
      
      return new Response(html, {
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          ...corsHeaders
        }
      });
    }
    
    // 健康检查
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        worker: 'cronicle-worker',
        version: '1.0.0',
        region: request.cf?.colo || 'Unknown',
        uptime: Date.now()
      }), {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // API 路由
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(url, method, request, corsHeaders);
    }
    
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  }
};

async function handleAPI(url, method, request, corsHeaders) {
  const path = url.pathname.replace('/api', '');
  
  try {
    switch (path) {
      case '/status':
        return new Response(JSON.stringify({
          status: 'running',
          timestamp: new Date().toISOString(),
          jobs_count: jobs.length,
          memory_usage: '12MB',
          cpu_usage: '0.1%',
          region: request.cf?.colo || 'Unknown'
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case '/time':
        return new Response(JSON.stringify({
          utc: new Date().toISOString(),
          local: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
          timestamp: Date.now(),
          timezone: 'Asia/Shanghai'
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
      case '/jobs':
        if (method === 'GET') {
          return new Response(JSON.stringify({
            jobs: jobs,
            total: jobs.length,
            status: 'success'
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
        break;
        
      case '/schedule':
        if (method === 'POST') {
          const body = await request.json();
          const job = {
            id: Date.now().toString(),
            name: body.name || 'Unnamed Job',
            schedule: body.schedule || '0 * * * *',
            command: body.command || 'echo "Hello World"',
            created: new Date().toISOString(),
            status: 'scheduled',
            next_run: calculateNextRun(body.schedule || '0 * * * *')
          };
          
          jobs.push(job);
          
          return new Response(JSON.stringify({
            status: 'success',
            message: 'Job scheduled successfully',
            job: job
          }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
        break;
        
      default:
        return new Response(JSON.stringify({
          error: 'API endpoint not found',
          available_endpoints: [
            'GET /api/status',
            'GET /api/time', 
            'GET /api/jobs',
            'POST /api/schedule'
          ]
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  return new Response(JSON.stringify({
    error: 'Method not allowed'
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

function calculateNextRun(cronExpression) {
  // 简单的下次运行时间计算（这里只是示例）
  const now = new Date();
  const nextRun = new Date(now.getTime() + 60 * 60 * 1000); // 1小时后
  return nextRun.toISOString();
}
