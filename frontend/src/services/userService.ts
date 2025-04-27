export const checkUserExists = async (userId: string): Promise<boolean> => {
  const response = await fetch(`/api/users/${userId}/exists`);
  return response.ok;
};
