import 'reflect-metadata';
import { Slot } from 'expo-router';
import '../mobx';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';

import { useInitStore } from '../stores/appInitStore';

const HomeLayout = observer(function HomeLayout() {
  const initStore = useInitStore();

  if (!initStore.isReady) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return <Slot />;
});

export default HomeLayout;
