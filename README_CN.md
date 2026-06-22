# @xingwangzhe/satteri-photoswipe

[English](README.md) | [中文文档](#)

> Satteri HAST 插件：用 PhotoSwipe v5 [官方属性](https://photoswipe.com/getting-started/) 将 `<img>` 包裹为 `<a>` 容器。

## 特性

- **PhotoSwipe v5 原生** — 使用 `data-pswp-width`、`data-pswp-height`、`data-pswp-srcset`、`data-cropped`
- **自动属性映射** — `width`/`height` → `data-pswp-*`，`alt` → `aria-label`，`srcset` → `data-pswp-srcset`
- **导出选择器** — `defaultSelector` 可直接传入 `PhotoSwipeLightbox` 配置
- **Tree-shakeable** — `defaultSelector` 是纯字符串常量，客户端导入不会引入 HAST 插件代码
- **零配置** — `photoswipe()` 开箱即用

## 安装

```bash
bun add @xingwangzhe/satteri-photoswipe
```

需要 `satteri >= 0.8.0`。[PhotoSwipe v5](https://photoswipe.com/) 需在浏览器端单独加载。

## 使用

### 构建时：HAST 插件

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
![照片](photo.jpg)
```

输出：

```html
<a
  href="photo.jpg"
  class="pswp-gallery-item"
  data-pswp-width="800"
  data-pswp-height="600"
  aria-label="照片"
>
  <img src="photo.jpg" alt="照片" />
</a>
```

### 浏览器端：PhotoSwipeLightbox

`defaultSelector` 是 **纯字符串常量**（`"a.pswp-gallery-item"`）。导入它只会带来 ~1 KB 的 JS，**不会**将 HAST/satteri 打包到客户端。

```js
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import { defaultSelector } from "@xingwangzhe/satteri-photoswipe";

const lightbox = new PhotoSwipeLightbox({
  gallery: "[data-pagefind-body]", // 文章容器
  children: defaultSelector, // "a.pswp-gallery-item"
  pswpModule: PhotoSwipe,
});
lightbox.init();
```

> **注意：** `defaultSelector` 可以在浏览器代码中安全导入。它是纯字符串常量，可以被 tree-shaking 正确剔除多余代码。而 `photoswipe()` 和 `createPhotoswipePlugin()` 是 HAST 插件工厂，仅供构建时使用。

## API

### `photoswipe(options?)`

| 参数        | 类型      | 默认值                  | 说明                                         |
| ----------- | --------- | ----------------------- | -------------------------------------------- |
| `className` | `string`  | `"pswp-gallery-item"`   | 添加到每个 `<a>` 的 CSS class                |
| `selector`  | `string`  | `"a.pswp-gallery-item"` | `PhotoSwipeLightbox` 的 gallery CSS 选择器   |
| `cropped`   | `boolean` | `false`                 | 是否添加 `data-cropped="true"`（裁剪缩略图） |

### `defaultSelector`

纯字符串常量：`"a.pswp-gallery-item"`。直接传入 `PhotoSwipeLightbox({ children: defaultSelector })`。

Tree-shakeable — 只导入字符串本身，不含任何 HAST 插件代码。

### `createPhotoswipePlugin(options?)`

仅构建时使用。返回 `{ plugin, selector }`，高级用法。

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
