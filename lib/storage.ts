import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload file to Firebase Storage
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: File[],
  basePath: string
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const path = `${basePath}/${Date.now()}-${index}-${file.name}`;
    return uploadFile(file, path);
  });
  
  return await Promise.all(uploadPromises);
}

/**
 * Delete file from Firebase Storage
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

/**
 * Delete multiple files
 */
export async function deleteFiles(urls: string[]): Promise<void> {
  await Promise.all(urls.map(url => deleteFile(url)));
}
