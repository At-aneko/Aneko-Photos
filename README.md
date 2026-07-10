# Aneko Photos

基于 Astro、Vue 和 Cloudflare Worker + R2 + KV 部署的照片画廊应用。

演示站点: [photo.aneko.ink](https://photo.aneko.ink)

## 技术栈

- **框架**: [Astro](https://astro.build/) + [Vue 3](https://vuejs.org/)
- **部署**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **存储**: Cloudflare KV（元数据） + Cloudflare R2（图片文件）
- **构建工具**: [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

## 项目结构

```text
src/
  components/
    gallery/       # 画廊 UI、瀑布流、灯箱和操作组件
    splash/        # 首页启动屏
  config/
    site.ts        # 站点和画廊配置
  features/
    gallery/       # 画廊类型、服务和组合式逻辑
  layouts/
    SiteLayout.astro
  pages/
    api/           # 公开 API 路由
    gallery.astro  # 画廊页面
    index.astro    # 首页
  server/          # API 路由和参数工具
scripts/
  prepare-cloudflare-assets.mjs
```

## 部署配置

需要使用 `wrangler.toml` 配置项目

- **KV 命名空间**:
binding = "KV"<br>
id = "your_kv_namespace_id"


- **R2 存储桶**:
binding = "R2" <br>
id = "your_r2_bucket_id"

部署前请确保在 Cloudflare 中已有对应的 KV 和 R2 存储

## 照片数据

前端通过 `/api/photos` 读取 KV 中的 `photos` 键。该键应保存一个 JSON 数组，格式示例：

```json
[
  {
    "id": "photo-001",
    "title": "Summer Light",
    "date": "2026-07-11",
    "description": "A quiet afternoon.",
    "images": [
      {
        "img": "summer-light.jpg"
      }
    ]
  }
]
```

## API

公开接口：

- `GET /api/photos`：读取 KV 中的 `photos` 数据
- `GET /api/images/:path`：从 R2 读取图片
- `GET /api/images/:path?dl`：以附件形式下载图片
