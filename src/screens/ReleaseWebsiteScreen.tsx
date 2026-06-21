import { useMemo } from 'react';
import { Linking, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { releaseConfig } from '../config/release';

const valueProps = [
  { icon: 'flash-outline', title: 'Fast in-run reference', body: 'Open the exact answer without digging through long guides.' },
  { icon: 'layers-outline', title: 'Build and item context', body: 'Keep loadouts, item notes, and run planning in one place.' },
  { icon: 'shield-checkmark-outline', title: 'Careful data review', body: 'Uncertain or scanner-derived data stays reviewable instead of guessed.' },
  { icon: 'cloud-offline-outline', title: 'Offline-first', body: 'Use the app during a run without depending on a connection.' },
];

const betaSteps = [
  'Join the tester list.',
  'Get the preview build or release link.',
  'Send feedback on bugs, confusion, or missing data.',
];

const reasons = [
  'Help shape the first public beta before broader release.',
  'Test the app on real devices and real runs, not just screenshots.',
  'Catch rough edges in item lookup, build tracking, and reference flows.',
];

export function ReleaseWebsiteScreen() {
  const signupUrl = useMemo(() => releaseConfig.betaSignupUrl.trim(), []);
  const contactEmail = releaseConfig.betaContactEmail.trim();

  const handleSignupPress = async () => {
    if (!signupUrl) {
      return;
    }

    await Linking.openURL(signupUrl);
  };

  const handleEmailPress = async () => {
    if (!contactEmail) {
      return;
    }

    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent('Storm Atlas beta tester sign-up')}`;
    await Linking.openURL(mailto);
  };

  return (
    <View style={styles.shell}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Ionicons name="planet-outline" size={18} color="#7ce7ff" />
            </View>
            <View>
              <Text style={styles.brandTitle}>Storm Atlas</Text>
              <Text style={styles.brandSubtitle}>Beta Tester Sign-Up</Text>
            </View>
          </View>
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>Risk of Rain 2 companion app</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroKicker}>Looking for testers</Text>
          <Text style={styles.heroTitle}>Help shape the Storm Atlas beta.</Text>
          <Text style={styles.heroSubtitle}>
            Storm Atlas is an offline-first companion app for fast item lookup, survivor planning, build tracking, and
            mechanics reference during real Risk of Rain 2 runs.
          </Text>

          <View style={styles.ctaRow}>
            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, !signupUrl && styles.disabledButton]}
              onPress={handleSignupPress}
              disabled={!signupUrl}
            >
              <Ionicons name="person-add-outline" size={18} color="#081018" />
              <Text style={styles.primaryButtonText}>{signupUrl ? 'Sign up to test' : 'Add your signup link'}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed, !contactEmail && styles.disabledButton]}
              onPress={handleEmailPress}
              disabled={!contactEmail}
            >
              <Ionicons name="mail-outline" size={18} color="#eef4f8" />
              <Text style={styles.secondaryButtonText}>{contactEmail ? 'Email the team' : 'Add contact email'}</Text>
            </Pressable>
          </View>

          <View style={styles.metaRow}>
            <MetaPill label="Offline-first" />
            <MetaPill label="Mobile beta" />
            <MetaPill label="Feedback-driven" />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="What testers get" />
          <View style={styles.featureGrid}>
            {valueProps.map((feature) => (
              <View key={feature.title} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as never} size={22} color="#7ce7ff" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureBody}>{feature.body}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.splitGrid}>
          <View style={styles.panel}>
            <SectionHeader title="How it works" />
            <View style={styles.listPanel}>
              {betaSteps.map((item, index) => (
                <View key={item} style={[styles.listRow, index < betaSteps.length - 1 && styles.listDivider]}>
                  <Text style={styles.listIndex}>{index + 1}</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.panel}>
            <SectionHeader title="Why join" />
            <View style={styles.reasonPanel}>
              {reasons.map((item) => (
                <View key={item} style={styles.reasonRow}>
                  <View style={styles.reasonDot} />
                  <Text style={styles.reasonText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Storm Atlas beta</Text>
          <Text style={styles.footerText}>
            {contactEmail ? `Questions or direct sign-up help: ${contactEmail}` : 'Add a contact email in release config.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionRule} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <View style={styles.metaPill}>
      <Text style={styles.metaPillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#05090d',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
    gap: 18,
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1d2a35',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2f4f5c',
    backgroundColor: '#10161b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#edf3f7',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    color: '#7ce7ff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  topBadge: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#10161b',
    borderWidth: 1,
    borderColor: '#253241',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBadgeText: {
    color: '#aebdcb',
    fontSize: 12,
    fontWeight: '700',
  },
  hero: {
    borderWidth: 1,
    borderColor: '#253241',
    backgroundColor: '#0b1117',
    borderRadius: 20,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  heroKicker: {
    color: '#ffb25f',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#f4f7fa',
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    color: '#b7c4d0',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    maxWidth: 700,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#7ce7ff',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: '#081018',
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#33424f',
    backgroundColor: '#111820',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#edf3f7',
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaPill: {
    minHeight: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2b3946',
    backgroundColor: '#0f151c',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaPillText: {
    color: '#9fb0be',
    fontSize: 12,
    fontWeight: '800',
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionRule: {
    width: 18,
    height: 1,
    backgroundColor: '#7ce7ff',
  },
  sectionTitle: {
    color: '#edf3f7',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureCard: {
    flexGrow: 1,
    flexBasis: '31%',
    minWidth: 158,
    borderWidth: 1,
    borderColor: '#24303b',
    backgroundColor: '#0b1117',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    minHeight: 156,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2f4c59',
    backgroundColor: '#10161b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: '#f4f7fa',
    fontSize: 16,
    fontWeight: '900',
  },
  featureBody: {
    color: '#aebdcb',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  splitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  panel: {
    flexGrow: 1,
    flexBasis: 320,
    gap: 10,
  },
  listPanel: {
    borderWidth: 1,
    borderColor: '#384a57',
    borderRadius: 16,
    backgroundColor: '#0b1117',
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'flex-start',
  },
  listDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#20323c',
  },
  listIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#081018',
    backgroundColor: '#7ce7ff',
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
  },
  listText: {
    flex: 1,
    color: '#dce4ea',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  reasonPanel: {
    borderWidth: 1,
    borderColor: '#2d5260',
    backgroundColor: '#071017',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  reasonRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  reasonDot: {
    width: 8,
    height: 8,
    marginTop: 7,
    borderRadius: 4,
    backgroundColor: '#ffb25f',
  },
  reasonText: {
    flex: 1,
    color: '#dce4ea',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#1d2a35',
    paddingTop: 16,
    gap: 4,
  },
  footerTitle: {
    color: '#edf3f7',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerText: {
    color: '#98a6b3',
    fontSize: 12,
    fontWeight: '600',
  },
});
