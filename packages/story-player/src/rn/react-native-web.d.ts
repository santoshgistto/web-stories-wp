/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * react-native-web ships JS without bundled .d.ts. Its public API is a
 * subset of react-native's, and @types/react-native is installed, so we
 * re-export those types under the react-native-web module name.
 */

declare module 'react-native-web' {
  export * from 'react-native';
}
