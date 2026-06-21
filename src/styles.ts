import { StyleSheet } from 'react-native';

export const surfaceShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.24,
  shadowRadius: 14,
  elevation: 4
};

export const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#080c11'
  },
  appHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1d2630',
    backgroundColor: '#0d131b'
  },
  appHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  appTitle: {
    color: '#f3f7fb',
    fontSize: 27,
    fontWeight: '900'
  },
  appSubtitle: {
    color: '#9aa7b5',
    fontSize: 13,
    marginTop: 3,
    fontWeight: '700'
  },
  filterCountBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#55b9ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterCountText: {
    color: '#061018',
    fontSize: 14,
    fontWeight: '900'
  },
  headerStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 13
  },
  statPill: {
    flex: 1,
    flexBasis: 0,
    flexShrink: 1,
    minWidth: 0,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  statValue: {
    color: '#f3f7fb',
    fontSize: 16,
    fontWeight: '900'
  },
  statLabel: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 1
  },
  tabContent: {
    flex: 1,
    overflow: 'hidden'
  },
  screenBody: {
    flex: 1,
    paddingHorizontal: 16
  },
  controls: {
    gap: 9,
    paddingTop: 12,
    paddingBottom: 8
  },
  searchRow: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#121a24',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 13,
    ...surfaceShadow
  },
  searchInput: {
    color: '#f3f7fb',
    flex: 1,
    fontSize: 16,
    paddingVertical: 0
  },
  chipRow: {
    gap: 8,
    paddingRight: 16
  },
  filterGroup: {
    gap: 6
  },
  filterGroupLabel: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  chip: {
    height: 34,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    paddingHorizontal: 11,
    maxWidth: 170
  },
  chipActive: {
    backgroundColor: '#1a2634'
  },
  chipText: {
    color: '#a8b4c0',
    fontSize: 12,
    fontWeight: '700'
  },
  chipTextActive: {
    color: '#f3f7fb'
  },
  selectedFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  selectedFilterChip: {
    maxWidth: '100%',
    minHeight: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#35506a',
    backgroundColor: '#172232',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  selectedFilterChipText: {
    color: '#e7eef7',
    fontSize: 12,
    fontWeight: '800'
  },
  advancedFilters: {
    gap: 8
  },
  advancedFiltersToggle: {
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 11
  },
  advancedFiltersToggleText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '900'
  },
  advancedFilterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  controlFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between'
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#101720',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    overflow: 'hidden'
  },
  segmentedButton: {
    minWidth: 70,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  segmentedButtonActive: {
    backgroundColor: '#e7eef7'
  },
  segmentedText: {
    color: '#a8b4c0',
    fontSize: 12,
    fontWeight: '800'
  },
  segmentedTextActive: {
    color: '#0b0f14'
  },
  iconToggle: {
    width: 40,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultsHeader: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  resultCount: {
    color: '#9aa7b5',
    fontSize: 13,
    fontWeight: '700',
  },
  clearInlineButton: {
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9
  },
  clearInlineText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '900'
  },
  listContent: {
    paddingBottom: 116,
    gap: 11
  },
  gridRow: {
    gap: 10
  },
  itemCard: {
    position: 'relative',
    backgroundColor: '#111923',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    ...surfaceShadow
  },
  listCard: {
    minHeight: 116,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 13,
    paddingLeft: 17
  },
  gridCard: {
    minHeight: 224,
    alignItems: 'center',
    padding: 12,
    paddingTop: 16,
    marginBottom: 10
  },
  cardIconFrame: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0b1118',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listIconFrame: {
    width: 58,
    height: 58
  },
  gridIconFrame: {
    width: 72,
    height: 72,
    marginBottom: 7
  },
  rarityStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4
  },
  iconFallback: {
    borderRadius: 8,
    backgroundColor: '#1d2630',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconFallbackText: {
    color: '#dbe4ee',
    fontSize: 14,
    fontWeight: '900'
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
    gap: 7
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  cardTitleArea: {
    flex: 1,
    minWidth: 0,
    gap: 5
  },
  itemName: {
    color: '#f3f7fb',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900'
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    minHeight: 19,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 7,
    maxWidth: '100%'
  },
  rarityLabel: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  itemQuote: {
    color: '#a8b4c0',
    fontSize: 12,
    lineHeight: 16
  },
  inlineGlossaryLink: {
    color: '#55b9ff',
    fontWeight: '900',
    textDecorationLine: 'underline'
  },
  detailsButton: {
    width: 31,
    height: 31,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#101720',
    alignItems: 'center',
    justifyContent: 'center'
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#101720',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  buildAddButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#55b9ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buildSubtractButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#101720',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stackBadge: {
    minWidth: 34,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#55b9ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7
  },
  stackBadgeText: {
    color: '#061018',
    fontSize: 12,
    fontWeight: '900'
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 'auto'
  },
  cardMetaRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5
  },
  metadataPill: {
    maxWidth: 112,
    minHeight: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0d131b',
    justifyContent: 'center',
    paddingHorizontal: 7
  },
  metadataPillText: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '800'
  },
  metadataMoreText: {
    color: '#7f8c99',
    fontSize: 10,
    fontWeight: '900'
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    gap: 14
  },
  emptyTitle: {
    color: '#dbe4ee',
    fontSize: 18,
    fontWeight: '800'
  },
  emptyAction: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#dbe4ee',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18
  },
  emptyActionText: {
    color: '#0b0f14',
    fontSize: 14,
    fontWeight: '900'
  },
  rarityContent: {
    padding: 16,
    paddingBottom: 116,
    gap: 20
  },
  rarityGroup: {
    gap: 10
  },
  rarityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#111923',
    paddingHorizontal: 12
  },
  rarityDot: {
    width: 9,
    height: 9,
    borderRadius: 9
  },
  rarityTitle: {
    color: '#f3f7fb',
    fontSize: 17,
    fontWeight: '900'
  },
  rarityCount: {
    color: '#8b98a5',
    fontSize: 13,
    fontWeight: '800'
  },
  relatedRow: {
    gap: 10,
    paddingRight: 16
  },
  iconTile: {
    width: 96,
    minHeight: 114,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#283747',
    backgroundColor: '#111923',
    alignItems: 'center',
    padding: 10,
    gap: 8
  },
  iconTileLabel: {
    color: '#dbe4ee',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    textAlign: 'center'
  },
  savedHeader: {
    paddingTop: 14,
    gap: 10
  },
  buildContent: {
    padding: 16,
    paddingBottom: 118,
    gap: 14
  },
  buildHero: {
    minHeight: 78,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    ...surfaceShadow
  },
  buildTitle: {
    color: '#f3f7fb',
    fontSize: 20,
    fontWeight: '900'
  },
  buildSubtitle: {
    color: '#9aa7b5',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3
  },
  clearBuildButton: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#71343d',
    backgroundColor: '#1e151b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11
  },
  clearBuildButtonArmed: {
    borderColor: '#ffd166',
    backgroundColor: '#ffd166'
  },
  clearBuildText: {
    color: '#ff8791',
    fontSize: 12,
    fontWeight: '900'
  },
  clearBuildTextArmed: {
    color: '#0b0f14'
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  summaryCard: {
    width: '31.7%',
    minHeight: 68,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  summaryValue: {
    color: '#f3f7fb',
    fontSize: 19,
    fontWeight: '900'
  },
  summaryLabel: {
    color: '#8b98a5',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: 2
  },
  buildList: {
    gap: 10
  },
  buildRow: {
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    ...surfaceShadow
  },
  buildItemInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  buildItemIcon: {
    width: 52,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#283747',
    backgroundColor: '#0b1118',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buildItemText: {
    flex: 1,
    minWidth: 0,
    gap: 4
  },
  stackStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  stackButton: {
    width: 31,
    height: 31,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#101720',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stackButtonPrimary: {
    width: 31,
    height: 31,
    borderRadius: 8,
    backgroundColor: '#55b9ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stackCountText: {
    color: '#f3f7fb',
    minWidth: 34,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '900'
  },
  removeButton: {
    width: 31,
    height: 31,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#71343d',
    backgroundColor: '#1e151b',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailScreen: {
    flex: 1
  },
  detailHeader: {
    height: 56,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1d2630',
    backgroundColor: '#0d131b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerIconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailHeaderTitle: {
    color: '#f3f7fb',
    flex: 1,
    fontSize: 16,
    fontWeight: '900'
  },
  detailContent: {
    padding: 16,
    paddingBottom: 36,
    gap: 18
  },
  detailHero: {
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#111923',
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    overflow: 'hidden',
    ...surfaceShadow
  },
  detailHeroGlow: {
    position: 'absolute',
    left: -28,
    top: -28,
    width: 140,
    height: 140,
    borderRadius: 70
  },
  detailIconWrap: {
    width: 116,
    minHeight: 116,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#283747',
    backgroundColor: '#0b1118',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailHeroText: {
    flex: 1,
    minWidth: 0,
    gap: 5
  },
  detailName: {
    color: '#f3f7fb',
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900'
  },
  detailRarity: {
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  detailQuote: {
    color: '#a8b4c0',
    fontSize: 14,
    lineHeight: 19
  },
  detailSection: {
    gap: 8
  },
  detailBuildPanel: {
    minHeight: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2b3948',
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 13
  },
  buildPanelMeta: {
    color: '#8b98a5',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3
  },
  synergyPromptCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#375a73',
    backgroundColor: '#102033',
    padding: 12,
    gap: 10,
    ...surfaceShadow
  },
  synergyPromptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  synergyPromptTitleWrap: {
    flex: 1,
    minWidth: 0
  },
  synergyPromptMeta: {
    color: '#9db2c3',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3
  },
  synergyDismissButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#31455a',
    backgroundColor: '#13283c',
    alignItems: 'center',
    justifyContent: 'center'
  },
  synergySuggestionList: {
    gap: 8
  },
  synergySuggestionRow: {
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263c50',
    backgroundColor: '#111923',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8
  },
  synergySuggestionInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9
  },
  synergySuggestionText: {
    flex: 1,
    minWidth: 0
  },
  synergySuggestionName: {
    color: '#f3f7fb',
    fontSize: 13,
    fontWeight: '900'
  },
  synergySuggestionReason: {
    color: '#8b98a5',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3
  },
  synergyAddButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#55b9ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  detailStackCount: {
    color: '#f3f7fb',
    minWidth: 42,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900'
  },
  sectionTitle: {
    color: '#f3f7fb',
    fontSize: 15,
    fontWeight: '900'
  },
  effectText: {
    color: '#dbe4ee',
    fontSize: 15,
    lineHeight: 22
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  staticChip: {
    minHeight: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#111923',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  staticChipText: {
    color: '#dbe4ee',
    fontSize: 12,
    fontWeight: '800'
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  metaBlock: {
    flex: 1,
    minWidth: 0,
    gap: 4
  },
  metaLabel: {
    color: '#8b98a5',
    fontSize: 11,
    fontWeight: '900'
  },
  metaValue: {
    color: '#dbe4ee',
    fontSize: 13,
    fontWeight: '800'
  },
  sourceButton: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#dbe4ee',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14
  },
  sourceButtonText: {
    color: '#0b0f14',
    fontSize: 13,
    fontWeight: '900'
  },
  tabBar: {
    position: 'relative',
    zIndex: 10,
    height: 76,
    borderTopWidth: 1,
    borderTopColor: '#1d2630',
    backgroundColor: '#0d131b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    height: 58,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  tabButtonCompact: {
    height: 48
  },
  tabButtonActive: {
    backgroundColor: '#111923'
  },
  tabLabel: {
    color: '#8b98a5',
    fontSize: 11,
    fontWeight: '900'
  },
  tabLabelActive: {
    color: '#55b9ff'
  }
});
