# @xingwangzhe/satteri-photoswipe

[中文文档](README_CN.md) | [English](#)

> Satteri HAST plugin that wraps `<img>` with PhotoSwipe v5 `<a>` containers using [official attributes](https://photoswipe.com/getting-started/).

## Features

- **PhotoSwipe v5 native** — uses `data-pswp-width`, `data-pswp-height`, `data-pswp-srcset`, `data-cropped`
- **Auto attribute mapping** — `width`/`height` → `data-pswp-*`, `alt` → `aria-label`, `srcset` → `data-pswp-srcset`
- **Class-based selector** — `a.pswp-gallery-item` works with Markdown images (no dimensions needed at build time)
- **Tree-shakeable `defaultSelector`** — a plain string constant, importing it won't pull HAST plugin code into your client bundle
- **Zero-config** — `photoswipe()` just works

## Install

```bash
bun add @xingwangzhe/satteri-photoswipe
```

Requires `satteri >= 0.8.0`. [PhotoSwipe v5](https://photoswipe.com/) must be loaded client-side.

## Usage

### Build-time: HAST plugin

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

Markdown image:

```markdown
![A photo](photo.jpg)
```

Output:

```html
<a
  href="photo.jpg"
  class="pswp-gallery-item"
  data-pswp-width="800"
  data-pswp-height="600"
  aria-label="A photo"
>
  <img src="photo.jpg" alt="A photo" />
</a>
```

### Client-side: PhotoSwipeLightbox

`defaultSelector` is a **pure string constant** (`"a.pswp-gallery-item"`). Importing it only brings ~1 KB of JS into your client bundle — no HAST/satteri dependency.

```js
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import { defaultSelector } from "@xingwangzhe/satteri-photoswipe";

const lightbox = new PhotoSwipeLightbox({
  gallery: "[data-pagefind-body]", // your article container
  children: defaultSelector, // "a.pswp-gallery-item"
  pswpModule: PhotoSwipe,
});
lightbox.init();
```

> **Note:** `defaultSelector` is safe to import in browser code. It's a plain string constant that tree-shakes cleanly — unlike the `photoswipe()` and `createPhotoswipePlugin()` functions, which are HAST plugin factories intended only for build-time use.

## API

### `photoswipe(options?)`

| Option      | Type      | Default                 | Description                                      |
| ----------- | --------- | ----------------------- | ------------------------------------------------ |
| `className` | `string`  | `"pswp-gallery-item"`   | CSS class added to each wrapped `<a>`            |
| `selector`  | `string`  | `"a.pswp-gallery-item"` | Gallery selector for `PhotoSwipeLightbox`        |
| `cropped`   | `boolean` | `false`                 | Add `data-cropped="true"` for cropped thumbnails |

### `defaultSelector`

A plain string constant: `"a.pswp-gallery-item"`. Pass directly to `PhotoSwipeLightbox({ children: defaultSelector })`.

Tree-shakeable — imports only the string itself, no HAST plugin code.

### `createPhotoswipePlugin(options?)`

Build-time only. Returns `{ plugin, selector }`. For advanced use cases.

## How it maps attributes

| `<img>` attribute | `<a>` attribute    | PhotoSwipe v5 usage           |
| ----------------- | ------------------ | ----------------------------- |
| `src`             | `href`             | Full-size image URL           |
| `width`           | `data-pswp-width`  | Image width in px (required)  |
| `height`          | `data-pswp-height` | Image height in px (required) |
| `srcset`          | `data-pswp-srcset` | Responsive images             |
| `data-pswp-src`   | `data-pswp-src`    | Passthrough (overrides href)  |
| `alt`             | `aria-label`       | Accessibility                 |

## License

MIT
