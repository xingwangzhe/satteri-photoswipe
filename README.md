# @xingwangzhe/satteri-photoswipe

[中文文档](README_CN.md) | [English](#)

> Satteri HAST plugin that wraps `<img>` with PhotoSwipe v5 `<a>` containers using [official attributes](https://photoswipe.com/getting-started/).

## Features

- **PhotoSwipe v5 native** — uses `data-pswp-width`, `data-pswp-height`, `data-pswp-srcset`, `data-cropped`
- **Auto attribute mapping** — `width`/`height` → `data-pswp-*`, `alt` → `aria-label`, `srcset` → `data-pswp-srcset`
- **Class-based selector** — `a.pswp-gallery-item` works with Markdown images (no dimensions needed at build time)
- **Exposes `defaultSelector`** — ready for `PhotoSwipeLightbox` config
- **Zero-config** — `photoswipe()` just works

## Install

```bash
bun add @xingwangzhe/satteri-photoswipe
```

Requires `satteri >= 0.8.0`. [PhotoSwipe v5](https://photoswipe.com/) must be loaded client-side.

## Usage

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

Markdown:

```markdown
![A photo](photo.jpg)
```

Output:

```html
<a href="photo.jpg" data-pswp-width="800" data-pswp-height="600" aria-label="A photo">
  <img src="photo.jpg" alt="A photo" />
</a>
```

### Client-side setup

```js
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import { defaultSelector } from "@xingwangzhe/satteri-photoswipe";

const lightbox = new PhotoSwipeLightbox({
  gallery: defaultSelector, // "a.pswp-gallery-item"
  children: "img",
  pswpModule: PhotoSwipe,
});
lightbox.init();
```

## API

### `photoswipe(options?)`

| Option      | Type      | Default                | Description                                       |
| ----------- | --------- | ---------------------- | ------------------------------------------------- |
| `className` | `string`  | `"pswp-gallery-item"`  | CSS class added to each wrapped `<a>`             |
| `selector`  | `string`  | `"a.pswp-gallery-item"`| Gallery selector for `PhotoSwipeLightbox`         |
| `cropped`   | `boolean` | `false`                | Add `data-cropped="true"` for cropped thumbnails  |

### `defaultSelector`

`"a.pswp-gallery-item"` — pass directly to `PhotoSwipeLightbox({ gallery: defaultSelector })`.

### `createPhotoswipePlugin(options?)`

Returns `{ plugin, selector }`. For advanced use cases.

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
