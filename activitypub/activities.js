export const followActivity = actorUri => ({
  type: 'Follow',
  object: actorUri
});

export const undoActivity = activity => ({
  type: 'Undo',
  object: activity
});
