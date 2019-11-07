# @nabidreams/react-native-audio-recorder

## Getting started

`$ npm install @nabidreams/react-native-audio-recorder --save`

### Mostly automatic installation

`$ react-native link @nabidreams/react-native-audio-recorder`

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `@nabidreams` ➜ `react-native-audio-recorder` and add `AudioRecorder.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libAudioRecorder.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`

- Add `import nabidreams.AudioRecorderPackage;` to the imports at the top of the file
- Add `new AudioRecorderPackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-audio-recorder'
   project(':react-native-audio-recorder').projectDir = new File(rootProject.projectDir, 	'../node_modules/@nabidreams/react-native-audio-recorder/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
     compile project(':react-native-audio-recorder')
   ```

## Usage

```javascript
import AudioRecorder from '@nabidreams/react-native-audio-recorder';

// TODO: What to do with the module?
AudioRecorder;
```

## Development

### Installation

```sh
yarn
cd example && yarn
cd ios && pod install
```

### Run Example

> Execute scripts below under `example` directory.

#### iOS

```sh
yarn ios
```

#### Andoid

```sh
yarn android
```

### Watch (for Native Source Change)

```
yarn watch
```

> After source change, run `yarn ios` or `yarn android` again to rebuild example app with updated sources.
