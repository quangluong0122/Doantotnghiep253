const revokedTokens = new Map();

export const revokeToken = (tokenId, expiresAt) => {
  revokedTokens.set(tokenId, expiresAt);
};

export const isTokenRevoked = (tokenId) => {
  const expiresAt = revokedTokens.get(tokenId);

  if (!expiresAt) {
    return false;
  }

  if (expiresAt <= Math.floor(Date.now() / 1000)) {
    revokedTokens.delete(tokenId);
    return false;
  }

  return true;
};
