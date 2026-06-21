import { Text, View } from 'react-native';

import { combatMechanics } from '../data/combatMechanics';
import type { CombatMechanic } from '../data/combatMechanics';
import type { SourceStatus } from '../data/mechanics';
import { ScreenScaffold } from './ScreenScaffold';

function formatStatus(status: SourceStatus) {
  return status.replace(/-/g, ' ');
}

export function TrustBadge({ status }: { status: SourceStatus }) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: status === 'needs-review' ? '#3a2b16' : '#14263a',
        borderColor: status === 'needs-review' ? '#f3d65f' : '#55b9ff',
        borderRadius: 6,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 3
      }}
    >
      <Text style={{ color: status === 'needs-review' ? '#f3d65f' : '#55b9ff', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>
        {formatStatus(status)}
      </Text>
    </View>
  );
}

export function SafetyWarning({ status }: { status: SourceStatus }) {
  if (status !== 'estimated' && status !== 'needs-review') {
    return null;
  }

  return (
    <Text style={{ color: '#e2bbc0', fontSize: 12, fontWeight: '700', lineHeight: 16 }}>
      {status === 'estimated' ? 'Estimated mechanic data.' : 'Needs review before treating as confirmed.'}
    </Text>
  );
}

export function MechanicsScreen(_props: Record<string, unknown>) {
  return (
    <ScreenScaffold
      title="Mechanics"
      rows={combatMechanics.map((mechanic) => ({
        id: mechanic.id,
        title: mechanic.title,
        subtitle: mechanic.shortDefinition,
        meta: `${mechanic.importanceLevel} · ${formatMechanicSourceStatus(mechanic)}`
      }))}
    />
  );
}

function formatMechanicSourceStatus(mechanic: CombatMechanic) {
  return (mechanic.sourceStatus ?? 'wiki-derived').replace(/-/g, ' ');
}
