# RNCouchbaseExample

## Installation

Install dependencies:
```
npm install
```
Install the React Native Couchbase Lite module:
```
npm install --save react-native-couchbase-lite
```
Link the module using rnpm:
```
rnpm link react-native-couchbase-lite
```

### Android

* Add the following in `android/app/build.gradle` under the `android` section:
```
packagingOptions {
		exclude 'META-INF/ASL2.0'
		exclude 'META-INF/LICENSE'
		exclude 'META-INF/NOTICE'
}
```

* Register the module in `getPackages` of `MainActivity.java`
```
  import me.fraserxu.rncouchbaselite.ReactCBLiteManager;

  ...


  @Override
  protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ReactCBLiteManager()				<----- Register the module
      );
  }
```


## Docker
Create a docker network called couchbase
```
docker network create --driver bridge couchbase
```
Run Couchbase Server in a docker container, and put it in the couchbase network
```
docker run --net=couchbase -d --name couchbase-server -p 8091-8094:8091-8094 -p 11210:11210 couchbase
```
Start a Sync Gateway container in the couchbase network
```
docker run --net=couchbase --name couchbase-sync-gateway-moviesapp -p 4984:4984 -d -v /tmp:/tmp/config couchbase/sync-gateway https://raw.githubusercontent.com/jmn8718/RNCouchbaseExample/master/sync-gateway-config.json
```

## Example Data

To load the data for the example, run the following command in a terminal
```
curl -H 'Content-Type: application/json' -vX POST 'http://localhost:4984/moviesapp/_bulk_docs' -d @MoviesExample.json
```

## Notes

On Android emulator, you must open a port mapping with adb reverse tcp:4984 tcp:4984 to make the Sync Gateway accessible from the Couchbase Listener.
