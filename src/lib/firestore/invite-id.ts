/** Must match Firestore rules: albumId + '__' + normalized email (see firestore.rules). */
export function albumInviteDocId(albumId: string, email: string): string {
  const e = email.trim().toLowerCase().replace(/\//g, "_");
  return `${albumId}__${e}`;
}
