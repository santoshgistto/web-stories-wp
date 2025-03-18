# DisplayLayer Storybook Preview

This directory contains a Storybook preview for stories using a simplified version of the DisplayLayer component. The preview allows you to visualize and interact with story templates in isolation, without needing to run the full story editor.

## Implementation Details

The implementation consists of:

1. A simplified version of the DisplayLayer component that renders elements from a template.
2. A story container with the proper 9:16 aspect ratio used by Web Stories.
3. Scaling of elements to fit the story container.
4. Controls to customize the appearance and behavior of the preview.
5. Support for different element types (text, image, shape).

## Usage

To view the DisplayLayer preview in Storybook:

1. Run `npm run storybook` from the project root.
2. Navigate to the "Stories Editor/Canvas/DisplayLayer" section in the Storybook sidebar.
3. Use the controls panel to customize the preview:
   - **backgroundColor**: Change the background color of the story page.
   - **showAnimations**: Toggle animations on/off.
   - **selectedElementId**: Select an element to highlight.

## Key Features

- **Proper Aspect Ratio**: The preview maintains the 9:16 aspect ratio used by Web Stories.
- **Element Scaling**: Elements are properly scaled to fit the story container.
- **Element Rendering**: Support for different element types (text, image, shape).
- **Selection Highlighting**: Selected elements are highlighted with a blue border.
- **Centered Display**: The story is centered in the preview area, following the layout guidelines.

## Limitations

This is a simplified version of the DisplayLayer component that doesn't include all the features of the real component. It's intended for visualization and testing purposes only.

## Future Improvements

Potential improvements to the preview:

1. Add more templates to showcase different types of stories.
2. Add more controls to customize the elements in the preview.
3. Implement support for more element types.
4. Add support for page attachments and shopping attachments.
5. Implement animation support.
