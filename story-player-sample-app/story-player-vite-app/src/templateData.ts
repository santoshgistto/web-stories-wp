// A small inline "template" story: occasion-themed page where one image
// element is tagged with `placeholderId: 'memoryPhoto'`. At runtime
// applyTemplate swaps that placeholder for a user-supplied photo while
// preserving position, rotation, mask, and animations.

export const TEMPLATE_PAGES = [
  {
    id: 'template-page-1',
    type: 'page',
    backgroundColor: { color: { r: 240, g: 200, b: 180 } },
    animations: [
      {
        id: 'caption-fade',
        type: 'effect-fade-in',
        targets: ['caption'],
        duration: 800,
        delay: 200,
      },
    ],
    elements: [
      {
        id: 'bg',
        type: 'shape',
        isBackground: true,
        isDefaultBackground: true,
        x: 1,
        y: 1,
        width: 1,
        height: 1,
        backgroundColor: { color: { r: 240, g: 200, b: 180 } },
        mask: { type: 'rectangle' },
        opacity: 100,
        rotationAngle: 0,
        flip: { vertical: false, horizontal: false },
        lockAspectRatio: true,
      },
      {
        id: 'photo-slot',
        type: 'image',
        // The tag applyTemplate looks for:
        placeholderId: 'memoryPhoto',
        x: 31,
        y: 80,
        width: 350,
        height: 500,
        opacity: 100,
        rotationAngle: -2,
        flip: { vertical: false, horizontal: false },
        lockAspectRatio: true,
        scale: 100,
        focalX: 50,
        focalY: 50,
        mask: { type: 'rectangle' },
        resource: {
          type: 'image',
          mimeType: 'image/png',
          src: 'https://placehold.co/350x500/cccccc/666666?text=Your+Photo+Here',
          width: 350,
          height: 500,
          alt: 'Photo placeholder',
        },
      },
      {
        id: 'caption',
        type: 'text',
        x: 50,
        y: 620,
        width: 312,
        height: 60,
        opacity: 100,
        rotationAngle: 0,
        flip: { vertical: false, horizontal: false },
        lockAspectRatio: true,
        backgroundTextMode: 'NONE',
        backgroundColor: { color: { r: 240, g: 200, b: 180 } },
        font: {
          family: 'Roboto',
          fallbacks: ['sans-serif'],
          service: 'fonts.google.com',
        },
        fontSize: 36,
        lineHeight: 1.2,
        textAlign: 'center',
        padding: { horizontal: 0, vertical: 0 },
        content:
          '<span style="font-weight: 700; color: #28292b">Halloween 2024</span>',
        tagName: 'p',
      },
    ],
  },
]

export const SAMPLE_USER_PHOTOS = [
  {
    label: 'Beach sunset',
    resource: {
      type: 'image',
      mimeType: 'image/jpeg',
      src: 'https://picsum.photos/id/1018/350/500',
      width: 350,
      height: 500,
      alt: 'Beach sunset',
    },
  },
  {
    label: 'Forest',
    resource: {
      type: 'image',
      mimeType: 'image/jpeg',
      src: 'https://picsum.photos/id/1015/350/500',
      width: 350,
      height: 500,
      alt: 'Forest path',
    },
  },
  {
    label: 'City',
    resource: {
      type: 'image',
      mimeType: 'image/jpeg',
      src: 'https://picsum.photos/id/1019/350/500',
      width: 350,
      height: 500,
      alt: 'City lights',
    },
  },
] as const
