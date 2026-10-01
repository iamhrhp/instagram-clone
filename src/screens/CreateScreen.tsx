import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, FlatList, Image, Alert, Platform, PanResponder, ScrollView } from 'react-native';
import { CameraRoll, PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import { CloseSquare, Camera, Setting2, ArrangeHorizontalSquare, ElementPlus, Text as TextIcon, ArrowRight, ArrowDown2, ArrowRight2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const CreateScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'POST' | 'STORY' | 'REEL'>('POST');
  const scrollRef = useRef<ScrollView>(null);
  const TABS = ['POST', 'STORY', 'REEL'];

  const [galleryImages, setGalleryImages] = useState<{ id: string, uri: string }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // Only capture swipe right if on the first tab to go back home
        return activeTab === 'POST' && gestureState.dx > 40 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 40) {
          // Swipe right to go back
          navigation.navigate('Home');
        }
      },
    })
  ).current;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photos = await CameraRoll.getPhotos({
          first: 50,
          assetType: 'Photos',
        });
        
        const formattedPhotos = photos.edges.map((edge, index) => ({
          id: index.toString(),
          uri: edge.node.image.uri,
        }));
        
        setGalleryImages(formattedPhotos);
        if (formattedPhotos.length > 0) {
          setSelectedImage(formattedPhotos[0].uri);
        }
      } catch (error) {
        console.error("Error fetching camera roll", error);
        // Fallback to dummy if permission denied or error
        const DUMMY_GALLERY = Array.from({ length: 30 }).map((_, i) => ({ 
          id: i.toString(), 
          uri: `https://picsum.photos/id/${i + 10}/500/500` 
        }));
        setGalleryImages(DUMMY_GALLERY);
        setSelectedImage(DUMMY_GALLERY[0].uri);
      }
    };

    fetchPhotos();
  }, []);

  const handleCameraPress = () => {
    Alert.alert("Camera", "Opening device camera...");
    // Ideally use react-native-image-picker launchCamera here
  };

  const renderGalleryGrid = (numColumns = 3, showCameraFirst = true) => {
    return (
      <FlatList
        data={showCameraFirst ? [{ id: 'camera_btn', uri: '' }, ...galleryImages] : galleryImages}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          if (item.id === 'camera_btn') {
            return (
              <TouchableOpacity style={[styles.galleryItem, { backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }]} onPress={handleCameraPress}>
                <Camera size={24} color="#FFF" />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity style={styles.galleryItem} onPress={() => setSelectedImage(item.uri)}>
              <Image source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} />
              {/* Optional multi-select circle */}
              {(activeTab === 'REEL' || selectedImage === item.uri) && (
                <View style={[styles.multiSelectCircle, selectedImage === item.uri && { backgroundColor: '#3797F0', borderColor: '#3797F0' }]} />
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  };

  const renderReelUI = () => (
    <View style={styles.flex1}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <CloseSquare size={28} color="#FFF" variant="Linear" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New reel</Text>
        <TouchableOpacity>
          <Setting2 size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.subHeader}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <View style={styles.pillBtn}><Text style={styles.pillText}>Edit</Text></View>
          <View style={styles.pillBtn}><Text style={styles.pillText}>Templates</Text></View>
        </View>
      </View>
      <View style={styles.galleryHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.galleryTitle}>Recents</Text>
          <ArrowDown2 size={16} color="#FFF" style={{marginLeft: 4}} />
        </View>
        <TouchableOpacity style={styles.multiSelectBtn}>
          <ArrangeHorizontalSquare size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.flex1}>
        {renderGalleryGrid(3, true)}
      </View>
    </View>
  );

  const renderPostUI = () => (
    <View style={styles.flex1}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <CloseSquare size={28} color="#FFF" variant="Linear" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New post</Text>
        <TouchableOpacity>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
      {/* Large Preview */}
      <View style={styles.postPreview}>
        {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%' }} />}
        <View style={styles.expandIcon}>
          <ElementPlus size={16} color="#FFF" />
        </View>
      </View>
      <View style={styles.galleryHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.galleryTitle}>Recents</Text>
          <ArrowRight2 size={16} color="#FFF" style={{marginLeft: 4}} />
        </View>
        <TouchableOpacity style={styles.multiSelectBtn}>
          <ArrangeHorizontalSquare size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.flex1}>
        {renderGalleryGrid(4, true)}
      </View>
    </View>
  );

  const renderStoryUI = () => (
    <View style={styles.flex1}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <CloseSquare size={28} color="#FFF" variant="Linear" />
        </TouchableOpacity>
        <Setting2 size={24} color="#FFF" />
      </View>
      
      {/* Camera Tools Left */}
      <View style={styles.storyToolsLeft}>
        <TouchableOpacity style={styles.toolItem}>
          <TextIcon size={24} color="#FFF" />
          <Text style={styles.toolText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem}>
          <Text style={styles.toolIconText}>∞</Text>
          <Text style={styles.toolText}>Boomerang</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem}>
          <ArrangeHorizontalSquare size={24} color="#FFF" />
          <Text style={styles.toolText}>Layout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem}>
          <ArrowDown2 size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Capture Button Area */}
      <View style={styles.captureArea}>
        <View style={styles.galleryThumbnail} />
        <View style={styles.captureRing}>
          <View style={styles.captureButton} />
        </View>
        <TouchableOpacity style={styles.flipCameraBtn}>
          <Refresh2 size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleTabPress = (tabName: 'POST' | 'STORY' | 'REEL', index: number) => {
    setActiveTab(tabName);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveTab(TABS[index] as any);
  };

  return (
    <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleScroll}
        style={{ flex: 1 }}
      >
        <View style={{ width }}>{renderPostUI()}</View>
        <View style={{ width }}>{renderStoryUI()}</View>
        <View style={{ width }}>{renderReelUI()}</View>
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity onPress={() => handleTabPress('POST', 0)}>
          <Text style={[styles.tabText, activeTab === 'POST' && styles.tabTextActive]}>POST</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('STORY', 1)}>
          <Text style={[styles.tabText, activeTab === 'STORY' && styles.tabTextActive]}>STORY</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('REEL', 2)}>
          <Text style={[styles.tabText, activeTab === 'REEL' && styles.tabTextActive]}>REEL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Assuming Refresh2 is available from iconsax
import { Refresh2 } from 'iconsax-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextBtnText: {
    color: '#3797F0',
    fontSize: 16,
    fontWeight: '600',
  },
  subHeader: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  pillBtn: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  galleryTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  multiSelectBtn: {
    backgroundColor: '#333',
    padding: 6,
    borderRadius: 16,
  },
  galleryItem: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#444',
    margin: 1,
  },
  multiSelectCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CCC',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  postPreview: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#555',
  },
  expandIcon: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 16,
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#FFF',
  },
  storyToolsLeft: {
    position: 'absolute',
    top: '30%',
    left: 15,
    gap: 25,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  toolIconText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  captureArea: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  galleryThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#444',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  captureRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF',
  },
  flipCameraBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CreateScreen;
