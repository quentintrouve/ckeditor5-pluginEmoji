//Category Emoji
export function EmojiCategory(editor) {
  editor.plugins.get('Emoji').addItems('Smiley', [
    { title: 'smiley face', character: '😊' },
  ]);
  editor.plugins.get('Emoji').addItems('Characters', [
    { title: 'wind blowing face', character: '🌬️' },
  ]);
}