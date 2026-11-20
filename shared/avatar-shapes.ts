// The ten avatar shapes, as stored in users.avatar_shape.
// The colour comes from the role, so only the shape is saved.
export const avatarShapes = [
  'scallop',
  'burst',
  'sparkle',
  'clover',
  'asterisk',
  'seal',
  'leaf',
  'halves',
  'octastar',
  'petals',
] as const

export type AvatarShape = (typeof avatarShapes)[number]
