import { Text } from 'react-native';

type LinkedGlossaryTextProps = {
  text: string;
  style: object;
  linkStyle: object;
  numberOfLines?: number;
  onOpenGlossaryEntry: (term: string) => void;
};

const glossaryLinkPattern = /\b(bosses'|bosses|boss)\b/gi;

export function LinkedGlossaryText({
  text,
  style,
  linkStyle,
  numberOfLines,
  onOpenGlossaryEntry
}: LinkedGlossaryTextProps) {
  const parts = text.split(glossaryLinkPattern);

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {parts.map((part, index) => {
        if (!part.match(glossaryLinkPattern)) {
          return part;
        }

        return (
          <Text
            key={`${part}:${index}`}
            accessibilityRole="link"
            onPress={() => onOpenGlossaryEntry('Bosses')}
            style={linkStyle}
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
}
