import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  findNodeHandle,
  StyleSheet,
  Text,
  View, FlatList,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity
} from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, Poppins_700Bold, Poppins_400Regular } from '@expo-google-fonts/poppins';

const { width, height } = Dimensions.get('screen');

const images = {
  man:
    'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  women:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  kids:
    'https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  skullcandy:
    'https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  help:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
};

const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: React.createRef()
}));

const Tab = React.forwardRef(({ item, onItemPress }, ref) => {
  return (
    <TouchableOpacity
      onPress={onItemPress}
    >
      <View ref={ref}>
        <Text style={{
          color: 'white',
          fontFamily: "Poppins_400Regular",
          fontSize: 84 / data.length,
          textTransform: 'uppercase'
        }}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  )
});

const Indicator = ({ measures, scrollX }) => {
  const inputRange = data.map((_, i) => i * width);
  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measures) => measures.width)
  });
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measures) => measures.x)
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        height: 4,
        width: indicatorWidth,
        bottom: -10,
        backgroundColor: 'white',
        transform: [{
          translateX
        }]
      }}
    />
  )
}

const Tabs = ({ data, scrollX, onItemPress }) => {
  const [measures, setMeasures] = React.useState([]);
  const containerRef = React.useRef()
  React.useEffect(() => {
    let m = [];
    data.forEach(item => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({
            x,
            y,
            width,
            height
          });

          if (m.length === data.length) {
            setMeasures(m);
          }
        }
      )
    })
  }, []);

  return (
    <View style={{ position: 'absolute', top: 90, width }}>
      <View
        ref={containerRef}
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly'
        }}
      >
        {data.map((item, index) => {
          return (
            <Tab
              key={item.key}
              item={item}
              ref={item.ref}
              onItemPress={() => onItemPress(index)}
            />
          )
        })}
      </View>
      {measures.length > 0 && (
        <Indicator measures={measures} scrollX={scrollX} />
      )}
    </View>
  )
}

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const ref = React.useRef();
  const onItemPress = React.useCallback((itemIndex) => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width
    })
  }, [])

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <Animated.FlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.image }}
                style={{ flex: 1, resizeMode: 'cover' }}
              />
              <View style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: 'rgba(0,0,0,0.3)' }
              ]}
              />
            </View>
          )
        }}
      />
      <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});