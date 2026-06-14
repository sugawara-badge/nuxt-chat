import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  type User,
  type Auth,
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  let unsubscribe: (() => void) | null = null
  let authReadyPromise: Promise<User | null> | null = null

  const getAuthInstance = (): Auth | null => {
    const { $auth } = useNuxtApp()
    return ($auth as Auth | null) ?? null
  }

  // 認証状態が確定するまで待機し、現在ログイン中のユーザーを返す
  const waitForAuth = (): Promise<User | null> => {
    if (authReadyPromise) {
      return authReadyPromise
    }

    authReadyPromise = new Promise((resolve) => {
      const auth = getAuthInstance()
      if (!auth) {
        loading.value = false
        resolve(null)
        return
      }

      loading.value = true
      let isFirstAuthState = true

      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        user.value = currentUser
        loading.value = false

        if (isFirstAuthState) {
          isFirstAuthState = false
          resolve(currentUser)
        }
      })
    })

    return authReadyPromise
  }

  const stopAuthListener = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    authReadyPromise = null
  }

  // 新規登録
  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    const auth = getAuthInstance()
    if (!auth) {
      return {
        user: null,
        error: new Error('Firebase認証が初期化されていません'),
      }
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      await updateProfile(userCredential.user, { displayName })
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  // ログイン
  const login = async (email: string, password: string) => {
    const auth = getAuthInstance()
    if (!auth) {
      return {
        user: null,
        error: new Error('Firebase認証が初期化されていません'),
      }
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  const logOut = async () => {
    try {
      const auth = getAuthInstance()
      if (!auth) {
        return {
          user: null,
          error: new Error('Firebase認証が初期化されていません'),
        }
      }
      await signOut(auth)
    } catch (e) {
      console.error(e);
    }
  }

  onScopeDispose(() => {
    stopAuthListener()
  })

  return {
    user,
    loading,
    signup,
    login,
    logOut,
    waitForAuth,
    stopAuthListener,
  }
})
