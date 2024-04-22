// noinspection JSUnusedGlobalSymbols

import 'reflect-metadata';
import { Stack } from 'expo-router';
import '../mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

import { useInitStore } from '../stores/AppInitStore';

const HomeLayout = observer(function HomeLayout() {
  const initStore = useInitStore();

  useEffect(() => {
    initStore.init().then();
  }, []);

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
