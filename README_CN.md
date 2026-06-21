# @xingwangzhe/satteri-photoswipe

[English](README.md) | [中文文档](#)

> Satteri HAST 插件：将 `<img>` 包裹为 PhotoSwipe `<a data-pswp>` 容器。

## 特性

- **零配置** — `photoswipe()` 开箱即用
- **智能属性映射** — `width`/`height` → `data-pswp-width/height`，`alt` → `aria-label`
- **可配置** — 通过参数传递额外属性
- **PhotoSwipe v5 兼容** — 使用 `data-pswp` 属性标准

## 安装

```bash
bun add @xingwangzhe/satteri-photoswipe
```

需要 `satteri >= 0.8.0` 作为 peer dependency。[PhotoSwipe](https://photoswipe.com/) 需在浏览器端单独加载。

## 使用

```js
// astro.config.mjs
import { photoswipe } from "@xingwangzhe/satteri-photoswipe";

export default defineConfig({
  markdown: {
    processor: satteri({
      hastPlugins: [photoswipe()],
    }),
  },
});
```

Markdown 图片：

```markdown
![一张照片](photo.jpg)
```

输出：

```html
<a href="photo.jpg" data-pswp="true" aria-label="一张照片">
  <img src="photo.jpg" alt="一张照片" />
</a>
```

### 带 width/height

```markdown
![图表](diagram.png)
```

若图片有 `width` 或 `height` 属性（如通过 HTML 手动设置），会自动转为 `data-pswp-width`/`data-pswp-height` — PhotoSwipe 需要这些属性避免打开时布局跳动。

## API

### `photoswipe(options?)`

工厂函数，返回 Satteri HAST 插件。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `extraAttrs` | `string[]` | `[]` | 额外要从 `<img>` 复制到 `<a>` 的属性名 |

### `createPhotoswipePlugin(options?)`

返回 `{ plugin }`，高级用法。

## 浏览器端设置

插件仅转换 HTML，你仍需在客户端初始化 PhotoSwipe：

```js
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";

const lightbox = new PhotoSwipeLightbox({
  gallery: "a[data-pswp]",
  children: "img",
  pswpModule: PhotoSwipe,
});
lightbox.init();
```

## 许可

MIT
