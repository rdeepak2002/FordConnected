# Ford Connected

## About

Poject for the Ford Smart Vehicle Connectivity Challenge [https://fordsmart.devpost.com/](https://fordsmart.devpost.com/)

## Requirements (iOS)

- Xcode (sign the project in the 'iOS' folder if necessary)
- yarn
- node
- React Native CLI
- Refer to 'React Native CLI Quickstart' [https://archive.reactnative.dev/docs/getting-started](https://archive.reactnative.dev/docs/getting-started)

## Getting Started (iOS)

Install Node dependencies: 

```
yarn install
```

Install pods for iOS: 

```
cd ios
pod install
cd ..
```

Start the iOS app:

```
react-native start ios
```

## Troubleshooting (iOS)

- [RuntimeError - [Xcodeproj] Unknown object version.](https://github.com/CocoaPods/CocoaPods/issues/7697)

    ```
    cd ios
    gem update xcodeproj
    gem install cocoapods --pre
    ```

- [You don't have write permissions for the /Library/Ruby/Gems/2.6.0 directory](https://github.com/rbenv/rbenv/issues/1267)
    ```
    cd ios
    export GEM_HOME="$HOME/.gem"
    gem update xcodeproj
    gem install cocoapods --pre
    ```