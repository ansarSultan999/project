import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  // Sign up function
  async function signup(email, password, name, role) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name
      })
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
        role: role || 'provider' // Default role
      })
      
      if (role === 'user') {
        navigate('/browse-talent');
      } else if (role === 'provider') {
        navigate('/dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }

      return userCredential.user
    } catch (error) {
      throw error
    }
  }

  // Login function
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userRole = await getUserRoleFromDatabase(userCredential.user.uid); // Fetch user role from database
      if (userRole === 'user') {
        navigate('/browse-talent');
      } else if (userRole === 'provider') {
        navigate('/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin-dashboard');
      }
      return userCredential.user
    } catch (error) {
      throw error
    }
  }

  // Admin login function
  async function adminLogin(username, password) {
    if (username === 'admin' && password === 'admin') {
      // Use a predefined admin account or create one if needed
      return signInWithEmailAndPassword(auth, 'admin@example.com', 'admin123')
        .then(userCredential => {
          setIsAdmin(true)
          return userCredential.user
        })
        .catch(error => {
          // If admin user doesn't exist yet, create it
          if (error.code === 'auth/user-not-found') {
            return createUserWithEmailAndPassword(auth, 'admin@example.com', 'admin123')
              .then(async userCredential => {
                await updateProfile(userCredential.user, { displayName: 'Admin' })
                await setDoc(doc(db, "users", userCredential.user.uid), {
                  uid: userCredential.user.uid,
                  name: 'Admin',
                  email: 'admin@example.com',
                  role: 'admin',
                  createdAt: new Date().toISOString()
                })
                setIsAdmin(true)
                return userCredential.user
              })
          }
          throw error
        })
    } else {
      throw new Error('Invalid admin credentials')
    }
  }

  // Logout function
  function logout() {
    setIsAdmin(false)
    setUserData(null)
    return signOut(auth)
  }

  // Check if user is admin
  async function checkAdminStatus(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        setIsAdmin(true)
        return true
      }
      return false
    } catch (error) {
      console.error("Error checking admin status:", error)
      return false
    }
  }

  // Fetch user data
  async function fetchUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUserData(userData)
        return userData
      }
      return null
    } catch (error) {
      console.error("Error fetching user data:", error)
      return null
    }
  }

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await checkAdminStatus(user.uid)
        await fetchUserData(user.uid)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    isAdmin,
    userData,
    signup,
    login,
    adminLogin,
    logout,
    fetchUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}