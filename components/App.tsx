import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'

type ImageItem = {
  id: string;
  imageUrl: string;
}

export default function App() {
  const UNSPLASH_ACCESS_KEY = '_3rj2cgJuVilhGnBRxR4pGTk_9dxJ-nEWwWVKBVjYyI';
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.unsplash.com/photos?page=${pageNum}&per_page=10&client_id=${UNSPLASH_ACCESS_KEY}`);
      const responseJSON = await response.json();
      const images = responseJSON.map((img: { urls: { regular: string } }, index: number) => ({
        id: (pageNum - 1) * 16 + index + 1,
        imageUrl: img.urls.regular
      })) as ImageItem[];
      setItems(prevItems => [...prevItems, ...images]);
      setPageNum(prevPage => prevPage + 1);
    } catch (error) {
      console.log("Error fetching images", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading && items.length === 0) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  return (
    <SafeAreaView style={styles.mainBackground}>
      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.headingCard}>
            <Text style={styles.headingText}>Unsplash</Text>
            <Text style={styles.subheadingText}>The internet's source for visuals.{"\n"}
              Powered by creators everywhere.</Text>
          </View>
        )}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              onError={() => console.log('Failed to load image')}
            />
          </View>
        )}
        onEndReached={fetchItems}
        onEndReachedThreshold={1}
        ListFooterComponent={() => (
          loading ? (
            <View style={styles.footerContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : null
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainBackground: {
    backgroundColor: 'pink',
  },
  headingCard: {
    backgroundColor: '#EDEEF7',
    marginVertical: 30,
    marginRight: 8,
    borderTopEndRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 8,
  },
  headingText: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 4
  },
  subheadingText: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'serif',
    padding: 4

  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  footerContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})