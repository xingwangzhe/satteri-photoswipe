# @xingwangzhe/satteri-photoswipe

[English](README.md) | [中文文档](#)

> Satteri HAST 插件：用 PhotoSwipe v5 [官方属性](https://photoswipe.com/getting-started/) 将 `<img>` 包裹为 `<a>` 容器。

## 特性

- **PhotoSwipe v5 原生** — 使用 `data-pswp-width`、`data-pswp-height`、`data-pswp-srcset`、`data-cropped`
- **自动属性映射** — `width`/`height` → `data-pswp-*`，`alt` → `aria-label`，`srcset` → `data-pswp-srcset`
- **导出选择器** — `defaultSelector` 可直接传入 `PhotoSwipeLightbox` 配置
- **零配置** — `photoswipe()` 开箱即用

## 安装

```bash
bun add @xingwangzhe/satteri-photoswipe
```

需要 `satteri >= 0.8.0`。[PhotoSwipe v5](https://photoswipe.com/) 需在浏览器端单独加载。

## 使用

```js
// astro.config.mjs
import { photoswipe, defaultSelector } from "@xingwangzhe/satteri-photoswipe";

export default defineConfig({
  markdown: {
    processor: satteri({
      hastPlugins: [photoswipe()],
    }),
  },
});
```

Markdown：

```markdown
![照片](photo.jpg)
```

输出：

```html
<a href="photo.jpg" data-pswp-width="800" data-pswp-height="600" aria-label="照片">
  <img src="photo.jpg" alt="照片" />
</a>
```

### 浏览器端初始化

```js
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import { defaultSelector } from "@xingwangzhe/satteri-photoswipe";

const lightbox = new PhotoSwipeLightbox({
  gallery: defaultSelector, // "a[data-pswp-width]"
  children: "img",
  pswpModule: PhotoSwipe,
});
lightbox.init();
```

## API

### `photoswipe(options?)`

| 参数       | 类型      | 默认值                 | 说明                                         |
| ---------- | --------- | ---------------------- | -------------------------------------------- |
| `selector` | `string`  | `"a[data-pswp-width]"` | `PhotoSwipeLightbox` 的 gallery CSS 选择器   |
| `cropped`  | `boolean` | `false`                | 是否添加 `data-cropped="true"`（裁剪缩略图） |

### `defaultSelector`

`"a[data-pswp-width]"` — 直接传入 `PhotoSwipeLightbox({ gallery: defaultSelector })`。

### `createPhotoswipePlugin(options?)`

返回 `{ plugin, selector }`，高级用法。

## 属性映射

| `<img>` 属性    | `<a>` 属性         | PhotoSwipe v5 用途      |
| --------------- | ------------------ | ----------------------- |
| `src`           | `href`             | 大图 URL                |
| `width`         | `data-pswp-width`  | 图片宽度（必填）        |
| `height`        | `data-pswp-height` | 图片高度（必填）        |
| `srcset`        | `data-pswp-srcset` | 响应式图片              |
| `data-pswp-src` | `data-pswp-src`    | 透传（优先级高于 href） |
| `alt`           | `aria-label`       | 无障碍                  |

## 许可

MIT
