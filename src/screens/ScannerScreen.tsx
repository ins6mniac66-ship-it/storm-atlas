import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState, useEffect, useRef } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  FlatList,
  Animated,
  Easing,
  Alert,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { mockRuns, MockRun, MockRunCell } from '../data/mockRuns';
import { findItemById, items, getItemIcon, ItemRecord } from '../data/items';

interface ScannerScreenProps {
  onImportBuild: (buildState: Record<string, number>) => void;
  onNavigateToBuild: () => void;
}

function getExtractedItemStatus(item: any): MockRunCell['status'] {
  return item.confidence < 0.73 || item.decision?.includes('rejected') ? 'uncertain' : 'accepted';
}

export function ScannerScreen({ onImportBuild, onNavigateToBuild }: ScannerScreenProps) {
  const [activeSegment, setActiveSegment] = useState<'screenshot' | 'json'>('screenshot');
  const [selectedRun, setSelectedRun] = useState<MockRun | null>(null);
  const [currentCells, setCurrentCells] = useState<MockRunCell[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('Waiting for screenshot');
  const [jsonText, setJsonText] = useState('');
  
  // Review Queue state
  const [reviewCellIndex, setReviewCellIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Scanning animation values
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      laserAnim.setValue(0);
    }
  }, [isScanning]);

  const handleSelectDemo = (run: MockRun) => {
    setIsScanning(true);
    setSelectedRun(run);
    
    // Simulate high-tech scanning pipeline for 1.6s
    setTimeout(() => {
      setIsScanning(false);
      setCurrentCells(JSON.parse(JSON.stringify(run.cells))); // deep clone cells to allow edits
    }, 1600);
  };

  const scanScreenshotBlob = async (blob: Blob, previewUri: string) => {
    setIsScanning(true);
    setScanStatus('Uploading screenshot to local extractor...');
    setCurrentCells([]);
    setSelectedRun({
      name: 'pending-screenshot-scan',
      displayName: 'Scanning screenshot...',
      image: { uri: previewUri },
      survivorClass: 'Detecting survivor',
      rows: 4,
      cols: 10,
      cells: []
    });

    try {
      const serverUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5001/extract' : 'http://localhost:5001/extract';

      setScanStatus('Running local item extraction...');
      const extractRes = await fetch(serverUrl, {
        method: 'POST',
        body: blob
      });

      if (!extractRes.ok) {
        let errorMessage = 'Extraction failed on server';

        try {
          const errorPayload = await extractRes.json();
          errorMessage = errorPayload.details || errorPayload.error || errorMessage;
        } catch {
          errorMessage = await extractRes.text();
        }

        throw new Error(errorMessage);
      }

      setScanStatus('Parsing scanner results...');
      const parsed = await extractRes.json();
      const classVal = parsed.class || 'Unknown Survivor';
      let parsedCells: MockRunCell[] = [];

      if (Array.isArray(parsed.items)) {
        parsedCells = parsed.items.map((item: any, idx: number) => ({
          cell: idx,
          id: item.id,
          count: item.count || 1,
          status: getExtractedItemStatus(item)
        }));
      }

      const realRun: MockRun = {
        name: 'live-screenshot-scan',
        displayName: `Extracted: ${classVal}`,
        image: { uri: previewUri },
        survivorClass: classVal,
        rows: 4,
        cols: 10,
        cells: parsedCells
      };

      const foundStacks = parsedCells.length;
      const noStacksStatus = 'No item stacks found. Use a 16:9 end-of-run screenshot with the Items Collected grid visible.';

      setSelectedRun(realRun);
      setCurrentCells(realRun.cells);
      setScanStatus(foundStacks > 0 ? `Found ${foundStacks} item stacks` : noStacksStatus);
    } catch (err) {
      console.warn(err);
      const message = err instanceof Error ? err.message : 'Unknown scanner failure';
      const shortMessage = message.includes('ModuleNotFoundError')
        ? 'Scan failed: the local Python extractor is missing a required module.'
        : `Scan failed: ${message.slice(0, 160)}`;
      setScanStatus(shortMessage);
      Alert.alert('Scan Error', shortMessage);
    } finally {
      setIsScanning(false);
    }
  };

  const handleUploadScreenshot = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png,image/jpeg,image/webp,image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const previewUri = URL.createObjectURL(file);
        await scanScreenshotBlob(file, previewUri);
      };
      input.click();
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Allow gallery access in system settings to import screenshots.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0]!.uri;
      const response = await fetch(selectedUri);
      const blob = await response.blob();
      await scanScreenshotBlob(blob, selectedUri);
    }
  };

  const handleImportJSON = () => {
    if (!jsonText.trim()) {
      Alert.alert('Empty Input', 'Please paste extraction JSON first.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      
      let classVal = parsed.class || 'Unknown Survivor';
      let parsedCells: MockRunCell[] = [];

      if (Array.isArray(parsed.items)) {
        parsedCells = parsed.items.map((item: any, idx: number) => ({
          cell: idx,
          id: item.id,
          count: item.count || 1,
          status: getExtractedItemStatus(item)
        }));
      } else if (Array.isArray(parsed.cells)) {
        parsedCells = parsed.cells.map((cell: any) => ({
          cell: cell.cell,
          id: cell.id,
          count: cell.count || 1,
          status: cell.status || 'accepted'
        }));
      } else {
        throw new Error('Unsupported JSON format. Needs items array or cells array.');
      }

      const tempRun: MockRun = {
        name: 'custom-json-import',
        displayName: `CLI Import: ${classVal}`,
        image: null,
        survivorClass: classVal,
        rows: 4,
        cols: 10,
        cells: parsedCells
      };

      setSelectedRun(tempRun);
      setCurrentCells(parsedCells);
      setScanStatus(`Imported ${parsedCells.length} item stacks from JSON`);
      Alert.alert('Success', `Imported run details for ${classVal}!`);
    } catch (e: any) {
      Alert.alert('JSON Error', e.message || 'Could not parse JSON. Check format.');
    }
  };

  // Review Queue corrections
  const handleSelectCorrection = (cellIndex: number, itemId: string) => {
    setCurrentCells((prev) =>
      prev.map((c) => (c.cell === cellIndex ? { ...c, id: itemId, status: 'accepted' } : c))
    );
    setReviewCellIndex(null);
    setSearchQuery('');
  };

  const handleApplyToBuild = () => {
    if (currentCells.length === 0) return;

    // Aggregate counts of verified/accepted items
    const aggregatedBuild: Record<string, number> = {};
    currentCells.forEach((cell) => {
      // Don't import uncertain cells unless verified
      if (cell.status === 'uncertain') return;
      
      const item = findItemById(cell.id);
      if (item) {
        aggregatedBuild[item.id] = (aggregatedBuild[item.id] ?? 0) + cell.count;
      }
    });

    onImportBuild(aggregatedBuild);
    Alert.alert(
      'Import Successful',
      'Extracted run items have been successfully merged into your active Build state!',
      [
        {
          text: 'Go to Build Tracker',
          onPress: onNavigateToBuild
        },
        {
          text: 'Scanner Terminal',
          style: 'cancel'
        }
      ]
    );
  };

  // List of items in the review queue
  const reviewQueue = currentCells.filter((c) => c.status === 'uncertain');
  const acceptedItems = currentCells.filter((c) => c.status !== 'uncertain');

  // Filter items for manual search modal
  const filteredSearchItems = searchQuery
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items.slice(0, 10);

  // Compute recommended candidates based on the item category/ID
  const getCandidateMatches = (uncertainId: string): ItemRecord[] => {
    const defaultMatches = [
      findItemById('scrap_red'),
      findItemById('pearl'),
      findItemById('hoof'),
      findItemById('syringe'),
      findItemById('crowbar')
    ].filter((x): x is ItemRecord => x !== null);

    const base = findItemById(uncertainId);
    if (!base) return defaultMatches.slice(0, 3);

    // Filter items sharing categories
    const related = items
      .filter((item) => item.id !== base.id && item.categories.some(c => base.categories.includes(c)))
      .slice(0, 3);

    return related.length >= 3 ? related : [...related, ...defaultMatches].slice(0, 3);
  };

  const selectedReviewCell = reviewCellIndex !== null ? currentCells.find(c => c.cell === reviewCellIndex) : null;
  const candidates = selectedReviewCell ? getCandidateMatches(selectedReviewCell.id) : [];

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200]
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>UES Cargo Terminal</Text>
      <Text style={styles.subtitle}>Extract and calibrate items from run screenshots</Text>

      {/* Segment controls */}
      <View style={styles.segmentContainer}>
        <Pressable
          style={[styles.segmentBtn, activeSegment === 'screenshot' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('screenshot')}
        >
          <Ionicons name="camera" size={16} color={activeSegment === 'screenshot' ? '#fff' : '#8b98a5'} />
          <Text style={[styles.segmentText, activeSegment === 'screenshot' && styles.segmentTextActive]}>
            Screenshot Scanner
          </Text>
        </Pressable>
        <Pressable
          style={[styles.segmentBtn, activeSegment === 'json' && styles.segmentBtnActive]}
          onPress={() => setActiveSegment('json')}
        >
          <Ionicons name="code-working" size={16} color={activeSegment === 'json' ? '#fff' : '#8b98a5'} />
          <Text style={[styles.segmentText, activeSegment === 'json' && styles.segmentTextActive]}>
            Import JSON
          </Text>
        </Pressable>
      </View>

      {activeSegment === 'screenshot' ? (
        <View style={styles.section}>
          {!selectedRun ? (
            <>
              <Text style={styles.sectionHeader}>Select Demo Screenshot</Text>
              <Text style={styles.sectionSubtitle}>Choose a run to simulate scanning:</Text>
              
              <View style={styles.demoGrid}>
                {mockRuns.map((run) => (
                  <Pressable
                    key={run.name}
                    style={styles.demoCard}
                    onPress={() => handleSelectDemo(run)}
                  >
                    <Image source={run.image} style={styles.demoThumbnail} resizeMode="cover" />
                    <View style={styles.demoMeta}>
                      <Text style={styles.demoName}>{run.displayName}</Text>
                      <View style={styles.survivorPill}>
                        <Ionicons name="person" size={11} color="#55b9ff" />
                        <Text style={styles.survivorClass}>{run.survivorClass}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>

              <View style={styles.customScreenshotContainer}>
                <Ionicons name="cloud-upload-outline" size={32} color="#55b9ff" />
                <Text style={styles.customScanTitle}>Scan Custom Screenshot</Text>
                <Text style={styles.customScanDesc}>
                  Select a screenshot from your device gallery. Scanning simulates locally offline, with custom JSON calibration fallbacks.
                </Text>
                <Pressable
                  style={styles.uploadBtn}
                  onPress={handleUploadScreenshot}
                >
                  <Text style={styles.uploadBtnText}>Upload Screenshot</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.scanOutputContainer}>
              <View style={styles.screenshotPreviewWrapper}>
                {selectedRun.image ? (
                  <Image source={selectedRun.image || undefined} style={styles.screenshotPreview} resizeMode="contain" />
                ) : (
                  <View style={styles.noImageContainer}>
                    <Ionicons name="code-slash" size={48} color="#8b98a5" />
                    <Text style={styles.noImageText}>CLI Extracted Run</Text>
                  </View>
                )}

                {isScanning && (
                  <Animated.View
                    style={[
                      styles.scannerLaser,
                      { transform: [{ translateY: laserTranslateY }] }
                    ]}
                  />
                )}

                {isScanning && (
                  <View style={styles.scanningOverlay}>
                    <Text style={styles.scanningText}>RUNNING HYBRID CROP MATCHING...</Text>
                    <Text style={styles.scanningSubtext}>{scanStatus}</Text>
                  </View>
                )}
              </View>

              {!isScanning && (
                <View style={styles.resultsTerminal}>
                  {/* Survivor Summary Header */}
                  <View style={styles.terminalHeader}>
                    <View>
                      <Text style={styles.terminalTitle}>{selectedRun.displayName}</Text>
                      <Text style={styles.terminalSubtitle}>Class: {selectedRun.survivorClass}</Text>
                      <Text style={styles.terminalStatus}>{scanStatus}</Text>
                    </View>
                    <Pressable
                      style={styles.resetBtn}
                      onPress={() => {
                        setSelectedRun(null);
                        setCurrentCells([]);
                        setScanStatus('Waiting for screenshot');
                      }}
                    >
                      <Text style={styles.resetBtnText}>Clear Scan</Text>
                    </Pressable>
                  </View>

                  {/* Review Queue Alerts */}
                  {reviewQueue.length > 0 ? (
                    <View style={styles.alertCard}>
                      <View style={styles.alertHeader}>
                        <Ionicons name="warning" size={18} color="#ffb703" />
                        <Text style={styles.alertTitle}>Review Queue ({reviewQueue.length} uncertain matches)</Text>
                      </View>
                      <Text style={styles.alertDesc}>
                        The scanner flagged these items with low confidence. Tap a slot to manually calibrate the target:
                      </Text>
                      
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewScroll}>
                        {reviewQueue.map((cell) => {
                          const item = findItemById(cell.id);
                          return (
                            <Pressable
                              key={cell.cell}
                              style={styles.reviewCellCard}
                              onPress={() => setReviewCellIndex(cell.cell)}
                            >
                              <View style={styles.reviewBadge}>
                                <Text style={styles.reviewBadgeText}>Cell {cell.cell}</Text>
                              </View>
                              {item && getItemIcon(item) ? (
                                <Image source={getItemIcon(item) || undefined} style={styles.reviewItemIcon} />
                              ) : (
                                <View style={styles.reviewFallbackIcon}>
                                  <Text style={styles.fallbackLetter}>?</Text>
                                </View>
                              )}
                              <Text style={styles.reviewItemName} numberOfLines={1}>
                                {item ? item.name : 'Unknown Item'}
                              </Text>
                              <Text style={styles.reviewItemCount}>x{cell.count}</Text>
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    </View>
                  ) : null}

                  {/* Accepted Grid view */}
                  <View style={styles.gridSection}>
                    <Text style={styles.gridHeading}>Extracted Run Inventory</Text>
                    <View style={styles.inventoryGrid}>
                      {acceptedItems.map((cell) => {
                        const item = findItemById(cell.id);
                        if (!item) return null;
                        return (
                          <View key={cell.cell} style={styles.gridItemSlot}>
                            <View style={[styles.itemPillBorder, styles[`rarity${item.rarity}`]]}>
                              <Image source={getItemIcon(item) || undefined} style={styles.itemSlotIcon} />
                              <View style={styles.itemCountOverlay}>
                                <Text style={styles.itemCountOverlayText}>x{cell.count}</Text>
                              </View>
                            </View>
                            <Text style={styles.itemSlotLabel} numberOfLines={1}>{item.name}</Text>
                          </View>
                        );
                      })}
                      {acceptedItems.length === 0 && (
                        <Text style={styles.emptyGridText}>
                          {currentCells.length === 0
                            ? 'No item grid cells were detected. Try a 16:9 end-of-run screenshot with Items Collected visible, or use Import JSON for extractor output.'
                            : 'No items verified. Check the Review Queue above!'}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Main build integration triggers */}
                  <Pressable
                    style={[
                      styles.applyBtn,
                      reviewQueue.length > 0 && styles.applyBtnWarn,
                      currentCells.length === 0 && styles.applyBtnDisabled
                    ]}
                    onPress={handleApplyToBuild}
                    disabled={currentCells.length === 0}
                  >
                    <Ionicons name="construct" size={18} color="#fff" />
                    <Text style={styles.applyBtnText}>
                      {reviewQueue.length > 0 ? 'Import Accepted Stacks' : 'Apply Run to Build Tracker'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Import CLI JSON Output</Text>
          <Text style={styles.sectionSubtitle}>
            Copy and paste the exact console JSON output from the <Text style={styles.codeText}>ror2_run_item_extractor.py</Text> script:
          </Text>

          <TextInput
            multiline
            value={jsonText}
            onChangeText={setJsonText}
            placeholder='e.g.&#10;{&#10;  "class": "Mercenary",&#10;  "items": [&#10;    { "id": "crowbar", "count": 4, "confidence": 0.95 }&#10;  ]&#10;}'
            placeholderTextColor="#5b6875"
            style={styles.jsonInput}
          />

          <Pressable style={styles.importJsonBtn} onPress={handleImportJSON}>
            <Ionicons name="cloud-download" size={18} color="#fff" />
            <Text style={styles.importJsonBtnText}>Parse and Preview Run</Text>
          </Pressable>
        </View>
      )}

      {/* Manual Selection modal for Calibrating Uncertainty Cells */}
      <Modal
        visible={reviewCellIndex !== null}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setReviewCellIndex(null);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Calibrate Cell {selectedReviewCell?.cell}</Text>
              <Pressable
                style={styles.closeModalBtn}
                onPress={() => {
                  setReviewCellIndex(null);
                  setSearchQuery('');
                }}
              >
                <Ionicons name="close" size={24} color="#8b98a5" />
              </Pressable>
            </View>

            {selectedReviewCell && (
              <ScrollView style={styles.modalBody}>
                {/* Candidates selection */}
                <Text style={styles.modalSectionHeader}>Top AI Candidates</Text>
                <View style={styles.candidatesRow}>
                  {candidates.map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.candidateCard}
                      onPress={() => handleSelectCorrection(selectedReviewCell.cell, item.id)}
                    >
                      <Image source={getItemIcon(item) || undefined} style={styles.candidateIcon} />
                      <Text style={styles.candidateName} numberOfLines={1}>{item.name}</Text>
                      <Text style={[styles.candidateRarity, styles[`text${item.rarity}`]]}>{item.rarity}</Text>
                    </Pressable>
                  ))}
                </View>

                {/* Manual catalog search selection */}
                <Text style={styles.modalSectionHeader}>Search All Items</Text>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Type item name..."
                  placeholderTextColor="#5b6875"
                  style={styles.searchInput}
                />

                <View style={styles.searchList}>
                  {filteredSearchItems.map((item) => (
                    <Pressable
                      key={item.id}
                      style={styles.searchItemRow}
                      onPress={() => handleSelectCorrection(selectedReviewCell.cell, item.id)}
                    >
                      <Image source={getItemIcon(item) || undefined} style={styles.searchItemIcon} />
                      <View style={styles.searchItemMeta}>
                        <Text style={styles.searchItemName}>{item.name}</Text>
                        <Text style={[styles.searchItemRarity, styles[`text${item.rarity}`]]}>{item.rarity}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#45505e" />
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0e14',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dbe4ee',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b98a5',
    marginBottom: 20,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#161b22',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#1f2631',
    borderColor: '#30363d',
    borderWidth: 1,
  },
  segmentText: {
    fontSize: 13,
    color: '#8b98a5',
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#55b9ff',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#8b98a5',
    marginBottom: 16,
  },
  demoGrid: {
    gap: 12,
    marginBottom: 24,
  },
  demoCard: {
    flexDirection: 'row',
    backgroundColor: '#131822',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2631',
    overflow: 'hidden',
    alignItems: 'center',
  },
  demoThumbnail: {
    width: 90,
    height: 75,
    backgroundColor: '#1b2230',
  },
  demoMeta: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  demoName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dbe4ee',
  },
  survivorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#192535',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  survivorClass: {
    fontSize: 11,
    color: '#55b9ff',
    fontWeight: 'bold',
  },
  customScreenshotContainer: {
    backgroundColor: '#131822',
    borderColor: '#1f2631',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  customScanTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#dbe4ee',
  },
  customScanDesc: {
    fontSize: 12,
    color: '#8b98a5',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 10,
  },
  uploadBtn: {
    backgroundColor: '#192535',
    borderColor: '#55b9ff',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#55b9ff',
  },
  scanOutputContainer: {
    backgroundColor: '#131822',
    borderColor: '#1f2631',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  screenshotPreviewWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: '#070a0f',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenshotPreview: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    alignItems: 'center',
    gap: 8,
  },
  noImageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b98a5',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 10, 15, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  scanningText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#55b9ff',
    letterSpacing: 2,
  },
  scanningSubtext: {
    fontSize: 11,
    color: '#8b98a5',
  },
  scannerLaser: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#55b9ff',
    shadowColor: '#55b9ff',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  resultsTerminal: {
    padding: 16,
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2631',
    paddingBottom: 12,
    marginBottom: 16,
  },
  terminalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#dbe4ee',
  },
  terminalSubtitle: {
    fontSize: 12,
    color: '#8b98a5',
    marginTop: 2,
  },
  terminalStatus: {
    fontSize: 11,
    color: '#55b9ff',
    marginTop: 4,
  },
  resetBtn: {
    backgroundColor: '#261b1e',
    borderColor: '#ff5555',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff5555',
  },
  alertCard: {
    backgroundColor: '#2b1b0b',
    borderColor: '#ffb703',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffb703',
  },
  alertDesc: {
    fontSize: 12,
    color: '#dbe4ee',
    lineHeight: 18,
    marginBottom: 12,
  },
  reviewScroll: {
    flexDirection: 'row',
  },
  reviewCellCard: {
    backgroundColor: '#1b2230',
    borderColor: '#30363d',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginRight: 10,
    width: 90,
  },
  reviewBadge: {
    backgroundColor: '#2b1b0b',
    borderColor: '#ffb703',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginBottom: 6,
  },
  reviewBadgeText: {
    fontSize: 9,
    color: '#ffb703',
    fontWeight: 'bold',
  },
  reviewItemIcon: {
    width: 38,
    height: 38,
    borderRadius: 4,
  },
  reviewFallbackIcon: {
    width: 38,
    height: 38,
    borderRadius: 4,
    backgroundColor: '#0b0e14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackLetter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffb703',
  },
  reviewItemName: {
    fontSize: 10,
    color: '#8b98a5',
    marginTop: 6,
    textAlign: 'center',
    width: '100%',
  },
  reviewItemCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#dbe4ee',
    marginTop: 2,
  },
  gridSection: {
    marginBottom: 20,
  },
  gridHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dbe4ee',
    marginBottom: 12,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItemSlot: {
    alignItems: 'center',
    width: 64,
  },
  itemSlotIcon: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  itemSlotLabel: {
    fontSize: 9,
    color: '#8b98a5',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  itemCountOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1b2230',
    borderColor: '#30363d',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  itemCountOverlayText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemPillBorder: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 1,
    position: 'relative',
  },
  rarityCommon: { borderColor: '#dbe4ee' },
  rarityUncommon: { borderColor: '#55ff55' },
  rarityLegendary: { borderColor: '#ff5555' },
  rarityBoss: { borderColor: '#ffff55' },
  rarityLunar: { borderColor: '#55ffff' },
  rarityVoid: { borderColor: '#cc55ff' },

  textCommon: { color: '#dbe4ee' },
  textUncommon: { color: '#55ff55' },
  textLegendary: { color: '#ff5555' },
  textBoss: { color: '#ffff55' },
  textLunar: { color: '#55ffff' },
  textVoid: { color: '#cc55ff' },

  emptyGridText: {
    fontSize: 12,
    color: '#8b98a5',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  applyBtn: {
    flexDirection: 'row',
    backgroundColor: '#55b9ff',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  applyBtnWarn: {
    backgroundColor: '#d69e2e',
  },
  applyBtnDisabled: {
    backgroundColor: '#303845',
    opacity: 0.65,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#070a0f',
  },
  jsonInput: {
    backgroundColor: '#131822',
    borderColor: '#1f2631',
    borderWidth: 1,
    borderRadius: 8,
    height: 180,
    color: '#dbe4ee',
    padding: 12,
    fontFamily: 'monospace',
    fontSize: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#55b9ff',
  },
  importJsonBtn: {
    flexDirection: 'row',
    backgroundColor: '#1b2230',
    borderColor: '#55b9ff',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  importJsonBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#55b9ff',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f131a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '75%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2631',
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dbe4ee',
  },
  closeModalBtn: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalSectionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#55b9ff',
    marginTop: 8,
    marginBottom: 10,
    letterSpacing: 1,
  },
  candidatesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  candidateCard: {
    flex: 1,
    backgroundColor: '#131822',
    borderColor: '#1f2631',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  candidateIcon: {
    width: 44,
    height: 44,
    borderRadius: 6,
    marginBottom: 6,
  },
  candidateName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#dbe4ee',
    textAlign: 'center',
    width: '100%',
  },
  candidateRarity: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
  searchInput: {
    backgroundColor: '#131822',
    borderColor: '#1f2631',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#dbe4ee',
    fontSize: 13,
    marginBottom: 12,
  },
  searchList: {
    gap: 8,
    paddingBottom: 20,
  },
  searchItemRow: {
    flexDirection: 'row',
    backgroundColor: '#131822',
    borderColor: '#1f2631',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  searchItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 4,
    marginRight: 10,
  },
  searchItemMeta: {
    flex: 1,
  },
  searchItemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#dbe4ee',
  },
  searchItemRarity: {
    fontSize: 10,
    marginTop: 2,
  },
});
