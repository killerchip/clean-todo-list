import 'reflect-metadata';
import { Stack } from 'expo-router';
import '../mobx';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';

import { useInitStore } from '../stores/AppInitStore';

const HomeLayout = observer(function HomeLayout() {
  const initStore = useInitStore();

  if (!initStore.isReady) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <Stack />;
});

export default HomeLayout;
