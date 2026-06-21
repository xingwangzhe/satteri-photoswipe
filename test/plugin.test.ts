import { describe, expect, it } from "vitest";
import { createPhotoswipePlugin, defaultSelector, photoswipe } from "../src/plugin";

function fakeImg(overrides?: Record<string, unknown>) {
  return {
    type: "element" as const,
    tagName: "img",
    properties: { src: "photo.jpg", ...overrides },
    children: [],
  };
}

describe("photoswipe() factory", () => {
  it("returns a plugin with a valid name", () => {
    const plugin = photoswipe();
    expect(plugin.name).toBe("satteri-photoswipe");
  });
});

describe("createPhotoswipePlugin", () => {
  it("wraps img with <a> containing PhotoSwipe v5 attributes", () => {
    const { plugin } = createPhotoswipePlugin();
    const img = fakeImg({ width: 800, height: 600, alt: "photo" });

    plugin.element!.visit(img as any, {
      wrapNode: (_: any, wrapper: any) => {
        expect(wrapper.tagName).toBe("a");
        expect(wrapper.properties.href).toBe("photo.jpg");
        expect(wrapper.properties["data-pswp-width"]).toBe("800");
        expect(wrapper.properties["data-pswp-height"]).toBe("600");
        expect(wrapper.properties["aria-label"]).toBe("photo");
      },
    } as any);
  });

  it("skips images without src", () => {
    const { plugin } = createPhotoswipePlugin();
    let wrapped = false;
    plugin.element!.visit(fakeImg({ src: "" }) as any, {
      wrapNode: () => { wrapped = true; },
    } as any);
    expect(wrapped).toBe(false);
  });

  it("passes through data-pswp-srcset", () => {
    const { plugin } = createPhotoswipePlugin();
    const img = fakeImg({ srcset: "img@2x.jpg 2x" });

    plugin.element!.visit(img as any, {
      wrapNode: (_: any, wrapper: any) => {
        expect(wrapper.properties["data-pswp-srcset"]).toBe("img@2x.jpg 2x");
      },
    } as any);
  });

  it("adds data-cropped=true when cropped option set", () => {
    const { plugin } = createPhotoswipePlugin({ cropped: true });
    const img = fakeImg();

    plugin.element!.visit(img as any, {
      wrapNode: (_: any, wrapper: any) => {
        expect(wrapper.properties["data-cropped"]).toBe("true");
      },
    } as any);
  });

  it("exposes default selector for PhotoSwipeLightbox", () => {
    expect(defaultSelector).toBe("a[data-pswp-width]");
  });

  it("custom selector", () => {
    const { selector } = createPhotoswipePlugin({ selector: ".my-gallery a" });
    expect(selector).toBe(".my-gallery a");
  });
});
