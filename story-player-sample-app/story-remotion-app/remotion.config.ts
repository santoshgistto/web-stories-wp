/*
 * Remotion configuration (Studio + CLI). The webpack override lives in
 * webpackOverride.cjs so the render server (server.mjs) can share it —
 * @remotion/bundler does not read this file.
 */
import { Config } from '@remotion/cli/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import webpackOverride from './webpackOverride.cjs';

Config.setEntryPoint('./src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setChromiumOpenGlRenderer('angle');

Config.overrideWebpackConfig(webpackOverride);
