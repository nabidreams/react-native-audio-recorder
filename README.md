# @nabidreams/react-native-audio

## Table of Contents

<!-- toc -->

- [Getting started](#getting-started)
  - [Mostly automatic installation](#mostly-automatic-installation)
  - [Manual installation](#manual-installation)
    - [iOS](#ios)
    - [Android](#android)
- [Usage](#usage)
- [Development](#development)
  - [Install Dependancies](#install-dependancies)
  - [Run Example](#run-example)
    - [iOS](#ios-1)
    - [Andoid](#andoid)
    - [Watch Source Change](#watch-source-change)

<!-- tocstop -->

## Getting started

`$ npm install @nabidreams/react-native-audio --save`

### Mostly automatic installation

`$ react-native link @nabidreams/react-native-audio`

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `@nabidreams` ➜ `react-native-audio` and add `Audio.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libAudio.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`

- Add `import com.nabidreams.lib.audio.AudioPackage;` to the imports at the top of the file
- Add `new AudioPackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-audio'
   project(':react-native-audio').projectDir = new File(rootProject.projectDir, 	'../node_modules/@nabidreams/react-native-audio/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
     compile project(':react-native-audio')
   ```

## Usage

```javascript
import Audio from '@nabidreams/react-native-audio';

// TODO: What to do with the module?
Audio;
```

## Development

> Execute the scripts below under `example` directory.

### Install Dependancies

```sh
$ yarn
```

### Run Example

#### iOS

```sh
$ yarn ios
```

#### Andoid

```sh
$ yarn android
```

#### Watch Source Change

```sh
$ yarn watch
```

> After native module source change, run `yarn ios` or `yarn android` again to rebuild example app with updated sources.
