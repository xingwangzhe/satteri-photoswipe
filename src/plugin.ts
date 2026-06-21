import { defineHastPlugin } from "satteri";

export interface PhotoswipeOptions {
  /** CSS selector for the gallery. Default: "a[data-pswp]" */
  gallerySelector?: string;
  /** Additional img attributes to copy to the wrapper link */
  extraAttrs?: string[];
}

const defaultAttrs = ["width", "height", "data-width", "data-height", "alt"];

function defaultRender(
  src: string,
  imgProps: Record<string, unknown>,
): Record<string, string> {
  const linkProps: Record<string, string> = {
    href: src,
    "data-pswp": "true",
  };
  for (const attr of defaultAttrs) {
    const v = imgProps[attr];
    if (v != null) {
      if (attr === "alt") {
        linkProps["aria-label"] = String(v);
      } else if (attr === "width" || attr === "data-width") {
        linkProps["data-pswp-width"] = String(v);
      } else if (attr === "height" || attr === "data-height") {
        linkProps["data-pswp-height"] = String(v);
      }
    }
  }
  return linkProps;
}

export function createPhotoswipePlugin(options?: PhotoswipeOptions) {
  const extraAttrs = options?.extraAttrs ?? [];

  const plugin = defineHastPlugin({
    name: "satteri-photoswipe",
    element: {
      filter: ["img"],
      visit(node, ctx) {
        const props = (node.properties ?? {}) as Record<string, unknown>;
        const src = String(props.src ?? "");
        if (!src) return;

        const linkProps = defaultRender(src, props);

        // Copy extra attributes
        for (const attr of extraAttrs) {
          const v = props[attr];
          if (v != null) linkProps[attr] = String(v);
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

  return { plugin };
}

/** Factory function. Usage: `photoswipe()` — aligns with `katex()` style */
export function photoswipe(options?: PhotoswipeOptions) {
  return createPhotoswipePlugin(options).plugin;
}

const defaultInstance = createPhotoswipePlugin();

export const photoswipePlugin = defaultInstance.plugin;
