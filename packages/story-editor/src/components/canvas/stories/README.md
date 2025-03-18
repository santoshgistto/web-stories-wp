# DisplayLayer Storybook Preview

This directory contains a Storybook preview for stories using the actual DisplayElement component. The preview allows you to visualize and interact with story templates in isolation, without needing to run the full story editor.

## Implementation Details

The implementation consists of:

1. Using the actual DisplayElement component from the canvas directory.
2. Providing the necessary context providers (UnitsProvider, TransformProvider) for the DisplayElement component to work properly.
3. Creating a template file with sample story data from the fashion inspiration template.
4. Adding controls to customize the appearance and behavior of the preview.
5. Support for different element types (text, image, shape).

## Architecture

The implementation follows a similar approach to the PagePreview component:

1. **Context Providers**: UnitsProvider and TransformProvider for proper element rendering.
2. **DisplayElement**: Using the actual DisplayElement component to render each element.
3. **Story Container**: A container with the proper 9:16 aspect ratio used by Web Stories.
4. **Controls**: Controls to customize the appearance and behavior of the preview.

## Usage

To view the DisplayLayer preview in Storybook:

1. Run `npm run storybook` from the project root.
2. Navigate to the "Stories Editor/Canvas/DisplayLayer" section in the Storybook sidebar.
3. Use the controls panel to customize the preview:
   - **backgroundColor**: Change the background color of the story page.
   - **showAnimations**: Toggle animations on/off.
   - **selectedElementId**: Select an element to highlight.

## Key Features

- **Actual Component**: Uses the actual DisplayElement component for accurate representation.
- **Proper Aspect Ratio**: The preview maintains the 9:16 aspect ratio used by Web Stories.
- **Element Rendering**: Support for different element types (text, image, shape).
- **Selection Highlighting**: Selected elements are highlighted with a blue border.
- **Centered Display**: The story is centered in the preview area, following the layout guidelines.

## Limitations

While this implementation uses the actual DisplayElement component, it still relies on a simplified approach that doesn't include all the features of the full story editor. It's intended for visualization and testing purposes only.

## Future Improvements

Potential improvements to the preview:

1. Add more templates to showcase different types of stories.
2. Add more controls to customize the elements in the preview.
3. Implement support for more element types.
4. Add support for page attachments and shopping attachments.
5. Implement animation support.
