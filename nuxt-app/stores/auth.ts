import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  type Auth,
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const { $auth } = useNuxtApp()
  const auth = $auth as Auth | null
  const user = ref<User | null>(null)
  const loading = ref(false)
  let unsubscribe: (() => void) | null = null

  // 認証リスナーを開始
  const startAuthListener = () => {
    loading.value = true
    if (!auth || unsubscribe) {
      loading.value = false
      return
    }

    unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      user.value = currentUser
      loading.value = false

      // ユーザーが未認証の場合、ログインページにリダイレクト
      if (!currentUser) {
        navigateTo('/login')
      } else {
        // ユーザーが認証された場合、プロフィールを取得
        const profileStore = useProfileStore()
        await profileStore.getProfile(currentUser.uid)
      }
    })
  }

  const stopAuthListener = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // 新規登録
  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
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
        password
      )
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error: error as Error }
    }
  }

  // ストアが破棄される際にリスナーをクリーンアップ
  onScopeDispose(() => {
    stopAuthListener()
  })

  return {
    user,
    loading,
    signup,
    login,
    startAuthListener,
    stopAuthListener,
  }
})