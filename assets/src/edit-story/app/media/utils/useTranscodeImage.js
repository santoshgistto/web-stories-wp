/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { useConfig } from '../../config';
import getFileName from './getFileName';

const isDevelopment = process.env.NODE_ENV === 'development';

function useTranscodeImage() {
  const { ffmpegCoreUrl } = useConfig();
  /**
   * Transcode a video using ffmpeg.
   *
   * @param {File} file File object of original video file.
   * @return {Promise<File>} File object of transcoded video file.
   */
  async function generateImage(file) {
    const { createFFmpeg, fetchFile } = await import(
      /* webpackChunkName: "chunk-ffmpeg" */ '@ffmpeg/ffmpeg'
    );

    const ffmpeg = createFFmpeg({
      corePath: ffmpegCoreUrl,
      log: isDevelopment,
    });
    await ffmpeg.load();

    const tempFileName = uuidv4() + '.png';
    const outputFileName = getFileName(file) + '.png';

    ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    // TODO: Optimize arguments.
    await ffmpeg.run(
      // Input filename.
      '-i',
      file.name,
      '-ss',
      '00:00:1',
      '-vframes',
      '1',
      tempFileName
    );

    const data = ffmpeg.FS('readFile', tempFileName);

    return new File(
      [new Blob([data.buffer], { type: 'image/png' })],
      outputFileName,
      {
        type: 'image/png',
      }
    );
  }

  return {
    generateImage
  };
}

export default useTranscodeImage;
