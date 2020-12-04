# react-native-android-auto

## Getting started

`$ npm install react-native-android-auto --save`

### Mostly automatic installation

In order to display the app launcher in the car display:

![Launcher](./docs/launcher.png)

You need to add the following lines to your app's `AndroidManifest.xml` under `<application>`:

```xml
<meta-data
    android:name="com.google.android.gms.car.application"
    android:resource="@xml/automotive_app_desc" />

<service
    android:name="com.shopify.rnandroidauto.CarService"
    android:exported="true">
    <intent-filter>
    <action android:name="com.google.android.car.action.CAR_APP" />
    </intent-filter>
</service>
```

## Usage
```javascript
import AndroidAuto from 'react-native-android-auto';
```

