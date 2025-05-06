import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import { v4 as uuidv4 } from 'uuid'

// Profile related functions
export const createProfile = async (userId, profileData) => {
  try {
    const profileRef = collection(db, 'profiles')
    const profile = {
      ...profileData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(profileRef, profile)
    return { ...profile, id: docRef.id }
  } catch (error) {
    console.error('Error creating profile:', error)
    throw error
  }
}

export const getUserProfile = async (userId) => {
  try {
    const profilesRef = collection(db, 'profiles')
    const q = query(profilesRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const profile = querySnapshot.docs[0].data()
      return { ...profile, id: querySnapshot.docs[0].id }
    }
    
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

export const getProfileById = async (profileId) => {
  try {
    const profileRef = doc(db, 'profiles', profileId)
    const profileSnap = await getDoc(profileRef)
    
    if (profileSnap.exists()) {
      return { ...profileSnap.data(), id: profileSnap.id }
    }
    
    return null
  } catch (error) {
    console.error('Error getting profile by ID:', error)
    throw error
  }
}

export const updateProfile = async (profileId, profileData) => {
  try {
    const profileRef = doc(db, 'profiles', profileId)
    
    await updateDoc(profileRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    })
    
    return { ...profileData, id: profileId }
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export const deleteProfile = async (profileId) => {
  try {
    const profileRef = doc(db, 'profiles', profileId)
    await deleteDoc(profileRef)
    return true
  } catch (error) {
    console.error('Error deleting profile:', error)
    throw error
  }
}

export const getAllProfiles = async () => {
  try {
    const profilesRef = collection(db, 'profiles')
    const q = query(profilesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))
  } catch (error) {
    console.error('Error getting all profiles:', error)
    throw error
  }
}

export const getProfilesBySkill = async (skill) => {
  try {
    const profilesRef = collection(db, 'profiles')
    const q = query(profilesRef, where('skill', '==', skill))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))
  } catch (error) {
    console.error('Error getting profiles by skill:', error)
    throw error
  }
}

export const getProfilesByLocation = async (location) => {
  try {
    const profilesRef = collection(db, 'profiles')
    const q = query(profilesRef, where('location', '==', location))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))
  } catch (error) {
    console.error('Error getting profiles by location:', error)
    throw error
  }
}

// File upload functions
export const uploadProfileImage = async (file, userId) => {
  try {
    const fileExtension = file.name.split('.').pop()
    const fileName = `${userId}_${uuidv4()}.${fileExtension}`
    const storageRef = ref(storage, `profile-images/${fileName}`)
    
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading profile image:', error)
    throw error
  }
}

export const deleteProfileImage = async (imageUrl) => {
  try {
    // Extract the path from the URL
    const imagePath = imageUrl.split('.com/o/')[1].split('?')[0]
    const decodedPath = decodeURIComponent(imagePath)
    const storageRef = ref(storage, decodedPath)
    
    await deleteObject(storageRef)
    return true
  } catch (error) {
    console.error('Error deleting profile image:', error)
    throw error
  }
}