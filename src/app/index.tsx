import * as Device from 'expo-device';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import "../db/connection";

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

type Word = {
  id: number;
  traditional: string;
  simplified: string;
  pinyin: string;
  definition: string;
};
export default function HomeScreen() {
  const db = useSQLiteContext();
  const [query, setQuery] = useState('')
  const results = query
    ? db.getAllSync<Word>(
        'SELECT * FROM words WHERE simplified = ? OR pinyin_search = ? OR definition LIKE ? LIMIT 20',
        [query, query.toLowerCase(), `%${query}%`]
      )
    : [];
  console.log(results);
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Type a character"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {results.map((word) => (
          <ThemedView key={word.id} type="backgroundElement" style={styles.result}>
            <ThemedText type="title">{word.simplified}</ThemedText>
            <ThemedText>{word.pinyin}</ThemedText>
            <ThemedText>{word.definition}</ThemedText>
          </ThemedView>
          ))}
        </ScrollView>


        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  input: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: 24,
  },
  scroll: {
    alignSelf: 'stretch',
  },
  scrollContent: {
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  result: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.four,
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
