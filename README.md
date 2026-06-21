# @xingwangzhe/satteri-photoswipe

[中文文档](README_CN.md) | [English](#)

> Satteri HAST plugin that wraps `<img>` with PhotoSwipe `<a data-pswp>` containers.

## Features

- **Zero-config** — `photoswipe()` just works
- **Smart attribute mapping** — `width`/`height` → `data-pswp-width/height`, `alt` → `aria-label`
- **Configurable** — custom attribute passthrough via options
- **PhotoSwipe v5 ready** — uses `data-pswp` attributes for the lightbox

## Install

```bash
bun add @xingwangzhe/satteri-photoswipe
```

Requires `satteri >= 0.8.0` as peer dependency. [PhotoSwipe](https://photoswipe.com/) must be loaded separately in the browser.

## Usage

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

Markdown images:

```markdown
![A photo](photo.jpg)
```

Output:

```html
<a href="photo.jpg" data-pswp="true" aria-label="A photo">
  <img src="photo.jpg" alt="A photo" />
</a>
```

### With width/height

```markdown
![diagram](diagram.png)
```

If the image has `width` or `height` attributes (e.g. from remark plugin or manual HTML), they become `data-pswp-width`/`data-pswp-height` — required by PhotoSwipe to avoid layout shift on open.

## API

### `photoswipe(options?)`

Factory function. Returns a Satteri HAST plugin.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extraAttrs` | `string[]` | `[]` | Additional img attributes to copy to `<a>` |

### `createPhotoswipePlugin(options?)`

Returns `{ plugin }`. For advanced use cases.

## Browser Setup

The plugin only transforms HTML. You still need to init PhotoSwipe client-side:

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

## License

MIT
