# FRP Panel 四个关键配置详解

::: info 文章信息
发布日期：2025年11月15日  
分类：技术 / 网络 / 内网穿透  
标签：#FRP #内网穿透 #Caddy #Docker #反向代理
:::

## 📝 前言

### 内网穿透方案对比

在开始之前，我们先了解一下常见的内网穿透方案：

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **FRP** | 开源免费、性能好、功能强大、支持多种协议 | 需要自建服务器 | 有云服务器的用户 |
| **Ngrok** | 使用简单、无需配置 | 免费版有限制、需要注册 | 临时测试、快速演示 |
| **ZeroTier** | 虚拟局域网、P2P 直连 | 需要安装客户端、可能被墙 | 多设备组网 |
| **Tailscale** | 基于 WireGuard、安全性高 | 需要注册账号、免费版有限制 | 企业级组网 |
| **花生壳** | 国内服务、稳定 | 免费版限制多、需要付费 | 商业场景 |
| **NPS** | 国产、Web 管理界面 | 功能相对简单 | 简单穿透需求 |

### 为什么选择 FRP Panel？

经过对比，我选择了 **FRP Panel**，原因如下：

1. **完全开源免费**：基于 FRP，无需担心服务商限制
2. **可视化界面**：提供 Web 管理面板，比命令行配置更直观
3. **功能强大**：支持 TCP、UDP、HTTP、HTTPS 等多种协议
4. **灵活可控**：完全掌控自己的数据和服务
5. **社区活跃**：遇到问题容易找到解决方案

> 📦 **项目地址**：[https://github.com/vaalacat/frp-panel](https://github.com/vaalacat/frp-panel)

### 搭建背景

我的使用场景是：

- **家里没有公网 IPv4**：运营商不给分配公网 IP，无法直接访问家里的设备
- **有一台闲置的腾讯云服务器**：配置是锋驰 200M，正好可以用来做内网穿透
- **需要访问的服务**：
  - 家里的 NAS（文件存储、媒体服务）
  - 各种自建服务（Home Assistant、Jellyfin 等）
  - 远程桌面、SSH 等

通过 FRP Panel，我可以：
- 在外网通过域名访问家里的所有服务
- 统一管理多个内网穿透隧道
- 使用 HTTPS 加密，保证访问安全
- 通过泛域名配置，动态添加新的服务

### 本文内容

FRP Panel 是一个基于 FRP 的可视化管理面板，通过合理的配置可以实现内网服务的统一管理和访问。本文将深入解析部署 FRP Panel 时最关键的四个配置，帮助大家快速搭建并理解其工作原理。

## 🎯 四个关键配置概览

1. **Caddyfile - 面板访问配置**：实现面板的 HTTPS 访问和反向代理
2. **Caddyfile - 泛域名配置**：实现内网服务的动态域名访问
3. **Docker Compose - 网络与证书配置**：打通容器网络并配置 SSL 证书
4. **FRP Master - 主服务配置**：配置 FRP 主服务的核心参数

---

## 1️⃣ Caddyfile - 面板访问配置

这是第一个关键配置，负责将外部域名请求转发到 FRP Panel 容器。

```caddyfile
# 面板访问
frpp.example.com {
    @http {
        protocol http
    }
    redir @http https://{host}{uri}
    # 反代面板容器端口
    reverse_proxy host.docker.internal:8900
}
```

### ⚙️ 需要修改的地方

- **域名**：将 `frpp.example.com` 替换为你的实际域名
  - 需要在 DNS 中配置 A 记录指向服务器 IP
  - 确保域名已正确解析

### 配置要点解析

- **域名绑定**：`frpp.example.com` 是面板的访问域名，需要提前在 DNS 中配置 A 记录指向服务器 IP
- **HTTP 重定向**：`@http` 匹配器捕获所有 HTTP 请求，自动重定向到 HTTPS，确保安全访问
- **反向代理**：`reverse_proxy host.docker.internal:8900` 是关键
  - `host.docker.internal` 是 Docker 的特殊主机名，指向宿主机
  - `8900` 是 FRP Panel 的 API 端口（在 frp-master 配置中定义）
  - 这样 Caddy 容器就能访问到运行在宿主机上的 FRP Panel 服务

### 为什么使用 host.docker.internal？

因为 FRP Panel 使用了 `network_mode: host`，它直接使用宿主机的网络，而不是 Docker 网络。Caddy 容器需要通过 `host.docker.internal` 来访问宿主机上的服务。

---

## 2️⃣ Caddyfile - 泛域名配置

这是第二个关键配置，实现通过动态子域名访问内网服务。

```caddyfile
# 泛域名访问 FRP 内网服务
*.frp.example.com {
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
    @http {
        protocol http
    }
    redir @http https://{host}{uri}
    # 反代 FRP vhost 端口
    reverse_proxy host.docker.internal:7000
}
```

### ⚙️ 需要修改的地方

- **泛域名**：将 `*.frp.example.com` 替换为你的实际泛域名
  - 例如：`*.frp.yourdomain.com`
  - 需要在 DNS 中配置泛域名解析（`*.frp.yourdomain.com` 指向服务器 IP）
- **Cloudflare API Token**：在 Docker Compose 中配置 `CLOUDFLARE_API_TOKEN` 环境变量（见下方配置）

### 配置要点解析

- **泛域名匹配**：`*.frp.example.com` 可以匹配任意子域名，如 `service1.frp.example.com`、`service2.frp.example.com` 等
- **DNS 验证证书**：`tls { dns cloudflare ... }` 使用 Cloudflare DNS API 自动申请和续期 SSL 证书
  - 这是泛域名证书的关键，因为通配符证书需要通过 DNS 验证
  - 需要配置 `CLOUDFLARE_API_TOKEN` 环境变量
- **反向代理到 FRP**：`reverse_proxy host.docker.internal:7000`
  - `7000` 是 FRP 的 vhost HTTP 端口
  - 所有通过泛域名访问的请求都会被转发到 FRP，由 FRP 根据域名路由到对应的内网服务

### 工作流程

1. 用户访问 `service1.frp.example.com`
2. Caddy 自动为该域名申请 SSL 证书（通过 Cloudflare DNS 验证）
3. Caddy 将 HTTPS 请求转发到 `host.docker.internal:7000`
4. FRP 根据域名找到对应的内网服务并转发请求

---

## 3️⃣ Docker Compose - 网络与证书配置

这是第三个关键配置，确保 Caddy 容器能正确访问宿主机服务并配置 SSL 证书。

```yaml
version: '3.8'

services:
  caddy:
    image: ghcr.io/caddybuilds/caddy-cloudflare:latest
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      - CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - /home/ubuntu/frp-pannal/caddy/Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config

volumes:
  caddy_data:
  caddy_config:
```

### ⚙️ 需要修改的地方

- **Cloudflare API Token**：将 `your_cloudflare_api_token_here` 替换为你的实际 Cloudflare API Token
  - 在 Cloudflare 控制台创建 API Token，需要 DNS 编辑权限
  - 建议使用环境变量文件（`.env`）管理，不要硬编码在配置中
- **Caddyfile 路径**：将 `/home/ubuntu/frp-pannal/caddy/Caddyfile` 替换为你的实际 Caddyfile 路径
  - 确保路径正确，文件存在且有读取权限

### 配置要点解析

- **镜像选择**：`ghcr.io/caddybuilds/caddy-cloudflare:latest`
  - 这是包含 Cloudflare DNS 插件的 Caddy 镜像
  - 普通 Caddy 镜像不支持 DNS 验证，无法申请泛域名证书
- **端口映射**：`80:80` 和 `443:443`
  - 将容器的 HTTP/HTTPS 端口映射到宿主机
  - 确保外部可以访问
- **环境变量**：`CLOUDFLARE_API_TOKEN`
  - 用于 Cloudflare DNS API 验证，申请泛域名证书
  - **安全提示**：生产环境建议使用 Docker secrets 或环境变量文件，不要硬编码在配置中
- **extra_hosts**：`host.docker.internal:host-gateway`
  - 这是关键配置！让容器内的 `host.docker.internal` 指向宿主机
  - `host-gateway` 是 Docker 的特殊值，自动解析为宿主机 IP
  - 没有这个配置，Caddy 无法访问宿主机上的服务
- **数据卷挂载**：
  - `Caddyfile`：配置文件
  - `caddy_data`：存储 SSL 证书和缓存
  - `caddy_config`：存储 Caddy 配置数据

---

## 4️⃣ FRP Master - 主服务配置

这是第四个关键配置，定义 FRP Panel 主服务的核心参数。

```yaml
services:
  frpp-master:
    image: vaalacat/frp-panel:latest
    network_mode: host
    environment:
      APP_GLOBAL_SECRET: your_global_secret_here
      MASTER_RPC_HOST: your-server-ip-or-domain.com #服务器的外部IP或域名
      MASTER_RPC_PORT: 8901 # rpc 端口
      MASTER_API_HOST: your-server-ip-or-domain.com #服务器的外部IP或域名
      MASTER_API_PORT: 8900 # api 端口
      MASTER_API_SCHEME: http
      CLIENT_RPC_URL: wss://frpp.example.com # rpc 地址
      CLIENT_API_URL: https://frpp.example.com # api 地址
    volumes:
      - ./data:/data # 数据存储位置
    restart: unless-stopped
    command: master
```

### ⚙️ 需要修改的地方

- **APP_GLOBAL_SECRET**：将 `your_global_secret_here` 替换为你的全局密钥（用于加密敏感数据）
  - 建议使用强随机字符串，长度至少 32 位
  - 例如：`openssl rand -hex 32` 生成的随机字符串
- **MASTER_RPC_HOST**：将 `your-server-ip-or-domain.com` 替换为服务器的外部 IP 或域名
  - 如果使用 IP：直接填写服务器公网 IP，如 `122.51.73.200`
  - 如果使用域名：填写域名，如 `frp.example.com`
- **MASTER_API_HOST**：同上，填写服务器的外部 IP 或域名
- **CLIENT_RPC_URL**：将 `frpp.example.com` 替换为你的面板访问域名
  - 必须与 Caddyfile 中的面板域名一致
  - 使用 `wss://` 协议（WebSocket Secure）
- **CLIENT_API_URL**：同上，填写面板访问域名
  - 必须与 Caddyfile 中的面板域名一致
  - 使用 `https://` 协议

### 配置要点解析

- **网络模式**：`network_mode: host`
  - 容器直接使用宿主机网络，端口直接暴露在宿主机上
  - 这样 Caddy 可以通过 `host.docker.internal:8900` 访问
  - 也方便 FRP 客户端直接连接到服务器端口
- **RPC 配置**：
  - `MASTER_RPC_HOST` 和 `MASTER_RPC_PORT`：主服务的 RPC 地址和端口
  - `CLIENT_RPC_URL`：客户端连接 RPC 的地址，使用 WebSocket Secure（`wss://`）
  - RPC 用于客户端与主服务之间的通信
- **API 配置**：
  - `MASTER_API_HOST` 和 `MASTER_API_PORT`：主服务的 API 地址和端口（8900）
  - `CLIENT_API_URL`：客户端访问 API 的地址，使用 HTTPS
  - API 用于面板的 Web 界面访问
- **URL 配置的重要性**：
  - `CLIENT_RPC_URL` 和 `CLIENT_API_URL` 必须使用域名（`frpp.example.com`）
  - 客户端会通过这些 URL 连接到服务器
  - 如果使用 IP，客户端可能无法正确连接（特别是通过 Caddy 反向代理时）
- **数据持久化**：`./data:/data` 挂载数据目录，确保配置和隧道信息不丢失

### 配置关系图

```
客户端浏览器
    ↓ (HTTPS)
Caddy (frpp.example.com:443)
    ↓ (HTTP)
FRP Panel (host.docker.internal:8900)
    ↓
面板 Web 界面
```

---

## 🔗 四个配置的协作关系

1. **Caddyfile 面板配置** + **Docker Compose 网络配置** → 实现面板的 HTTPS 访问
2. **Caddyfile 泛域名配置** + **Docker Compose 证书配置** → 实现内网服务的动态域名访问
3. **FRP Master 配置** → 定义主服务的核心参数，与 Caddy 配置的端口对应

### 端口映射关系

| 服务 | 端口 | 说明 |
|------|------|------|
| Caddy | 80, 443 | HTTP/HTTPS 入口 |
| FRP Panel API | 8900 | 面板 Web 接口 |
| FRP Panel RPC | 8901 | 客户端 RPC 连接 |
| FRP vhost | 7000 | 内网服务 HTTP 转发 |

---

## ⚠️ 常见问题与注意事项

### 1. 证书申请失败

**问题**：泛域名证书申请失败

**原因**：
- Cloudflare API Token 权限不足
- DNS 解析未正确配置
- Token 已过期或无效

**解决**：
- 确保 API Token 有 DNS 编辑权限
- 检查域名 DNS 记录是否正确
- 验证 Token 是否有效

### 2. 无法访问面板

**问题**：通过域名无法访问面板

**原因**：
- `host.docker.internal` 未正确配置
- FRP Panel 未启动或端口不对
- 防火墙阻止了端口访问

**解决**：
- 检查 `extra_hosts` 配置
- 确认 FRP Panel 容器运行状态：`docker ps`
- 检查端口是否被占用：`netstat -tlnp | grep 8900`

### 3. 内网服务无法访问

**问题**：通过泛域名无法访问内网服务

**原因**：
- FRP 客户端未正确配置域名
- FRP vhost 端口（7000）未正确映射
- 内网服务本身有问题

**解决**：
- 在 FRP Panel 中检查隧道配置
- 确认域名配置正确
- 测试直接访问内网服务是否正常

### 4. 安全建议

- **API Token 保护**：不要将 Cloudflare API Token 硬编码在配置文件中，使用环境变量文件或 Docker secrets
- **防火墙配置**：只开放必要的端口（80, 443），其他端口通过防火墙限制访问
- **定期更新**：保持 Caddy 和 FRP Panel 镜像为最新版本
- **日志监控**：定期检查 Caddy 和 FRP Panel 的日志，发现异常及时处理

---

## 📚 总结

FRP Panel 的部署核心在于理解四个配置的作用和它们之间的协作关系：

1. **Caddyfile 面板配置**：建立外部访问入口
2. **Caddyfile 泛域名配置**：实现动态域名访问
3. **Docker Compose 配置**：打通网络和证书申请
4. **FRP Master 配置**：定义核心服务参数

掌握这四个配置，就能轻松搭建一个功能完整的内网穿透管理平台。记住关键点：网络打通（`host.docker.internal`）、端口对应、域名配置，就能避免大部分部署问题。

---

## 🙏 致谢

感谢 [FRP Panel](https://github.com/vaalacat/frp-panel) 项目的作者 [@vaalacat](https://github.com/vaalacat) 开发并维护这个优秀的开源项目，让内网穿透的管理变得如此简单和直观。正是有了这些优秀的开源项目，我们才能更轻松地解决实际问题。

如果这篇文章对你有帮助，也欢迎给 FRP Panel 项目点个 ⭐ Star，支持开源项目的发展。

---

*内网穿透，让远程访问变得简单* 🚀

