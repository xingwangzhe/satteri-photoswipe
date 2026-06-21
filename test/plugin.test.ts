import { describe, expect, it } from "vitest";
import { createPhotoswipePlugin, photoswipe } from "../src/plugin";

// Helper: simulate HAST element node
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

  it("has element visitor with img filter", () => {
    const plugin = photoswipe();
    expect(plugin.element).toBeDefined();
  });
});

describe("createPhotoswipePlugin", () => {
  it("wraps img with data-pswp link", () => {
    let wrapped = false;
    const { plugin } = createPhotoswipePlugin();
    const img = fakeImg();

    // Simulate Satteri HAST context
    const ctx = {
      wrapNode: (_node: any, wrapper: any) => {
        wrapped = true;
        expect(wrapper.type).toBe("element");
        expect(wrapper.tagName).toBe("a");
        expect(wrapper.properties["data-pswp"]).toBe("true");
        expect(wrapper.properties.href).toBe("photo.jpg");
      },
    };

    plugin.element!.visit(img as any, ctx as any);
    expect(wrapped).toBe(true);
  });

  it("copies width/height to data-pswp-width/height", () => {
    const { plugin } = createPhotoswipePlugin();
    const img = fakeImg({ width: 800, height: 600 });

    plugin.element!.visit(img as any, {
      wrapNode: (_: any, wrapper: any) => {
        expect(wrapper.properties["data-pswp-width"]).toBe("800");
        expect(wrapper.properties["data-pswp-height"]).toBe("600");
      },
    } as any);
  });

  it("copies alt to aria-label", () => {
    const { plugin } = createPhotoswipePlugin();
    const img = fakeImg({ alt: "A photo" });

    plugin.element!.visit(img as any, {
      wrapNode: (_: any, wrapper: any) => {
        expect(wrapper.properties["aria-label"]).toBe("A photo");
      },
    } as any);
  });

  it("skips images without src", () => {
    let wrapped = false;
    const { plugin } = createPhotoswipePlugin();
    const img = fakeImg({ src: "" });

    plugin.element!.visit(img as any, {
      wrapNode: () => {
        wrapped = true;
      },
    } as any);

    expect(wrapped).toBe(false);
  });
});
