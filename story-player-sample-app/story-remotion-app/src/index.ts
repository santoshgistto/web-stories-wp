/*
 * Remotion entry point. Importing @googleforcreators/story-player anywhere in
 * the bundle auto-registers all built-in element types, which PreviewPage needs
 * to render images, text, shapes, etc.
 */
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
