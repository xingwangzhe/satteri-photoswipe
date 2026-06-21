import { defineHastPlugin } from "satteri";

export interface PhotoswipeOptions {
  /**
   * CSS selector for PhotoSwipe to find gallery links.
   * Default: "a[data-pswp-width]" — PhotoSwipe v5 requires width/height.
   * @see https://photoswipe.com/getting-started/
   */
  selector?: string;
  /** Whether to mark thumbnail as cropped (affects opening animation). Default: false */
  cropped?: boolean;
}

/** Standard PhotoSwipe v5 link attributes */
const PSWP_ATTRS = {
  WIDTH: "data-pswp-width",
  HEIGHT: "data-pswp-height",
  SRC: "data-pswp-src",
  SRCSET: "data-pswp-srcset",
  CROPPED: "data-cropped",
} as const;

export function createPhotoswipePlugin(options?: PhotoswipeOptions) {
  const selector = options?.selector ?? `a[${PSWP_ATTRS.WIDTH}]`;
  const cropped = options?.cropped ?? false;

  const plugin = defineHastPlugin({
    name: "satteri-photoswipe",
    element: {
      filter: ["img"],
      visit(node, ctx) {
        const props = (node.properties ?? {}) as Record<string, unknown>;
        const src = String(props.src ?? "");
        if (!src) return;

        const linkProps: Record<string, string> = { href: src };

        // width/height → data-pswp-width/height (required by PhotoSwipe v5)
        const w = props.width ?? props[PSWP_ATTRS.WIDTH];
        const h = props.height ?? props[PSWP_ATTRS.HEIGHT];
        if (w != null) linkProps[PSWP_ATTRS.WIDTH] = String(w);
        if (h != null) linkProps[PSWP_ATTRS.HEIGHT] = String(h);

        // srcset → data-pswp-srcset
        const srcset = props.srcset ?? props[PSWP_ATTRS.SRCSET];
        if (srcset != null) linkProps[PSWP_ATTRS.SRCSET] = String(srcset);

        // data-pswp-src (higher priority than href)
        if (props[PSWP_ATTRS.SRC] != null) {
          linkProps[PSWP_ATTRS.SRC] = String(props[PSWP_ATTRS.SRC]);
        }

        // alt → aria-label (accessibility)
        if (props.alt != null) {
          linkProps["aria-label"] = String(props.alt);
        }

        if (cropped) {
          linkProps[PSWP_ATTRS.CROPPED] = "true";
        }

        ctx.wrapNode(node, {
          type: "element",
          tagName: "a",
          properties: linkProps,
          children: [],
        } as any);
      },
    },
  });

  return { plugin, selector };
}

/** Factory function. Usage: `photoswipe()` — aligns with `katex()` style */
export function photoswipe(options?: PhotoswipeOptions) {
  return createPhotoswipePlugin(options).plugin;
}

const defaultInstance = createPhotoswipePlugin();

export const photoswipePlugin = defaultInstance.plugin;
export const defaultSelector = defaultInstance.selector;
