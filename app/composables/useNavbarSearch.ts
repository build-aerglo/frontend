export const useNavbarSearch = () => {
  // true = a hero search exists on this page and is currently visible
  const heroSearchVisible = useState<boolean>('heroSearchVisible', () => false)
  // true = this page has opted into the navbar search feature at all
  const hasHeroSearch = useState<boolean>('hasHeroSearch', () => false)

  const registerHeroSearch = () => {
    hasHeroSearch.value = true
    heroSearchVisible.value = true
  }

  const unregisterHeroSearch = () => {
    hasHeroSearch.value = false
    heroSearchVisible.value = false
  }

  const setHeroVisible = (visible: boolean) => {
    heroSearchVisible.value = visible
  }

  // The navbar search bar should show when a hero search exists but has scrolled away
  const showNavbarSearch = computed(() => hasHeroSearch.value && !heroSearchVisible.value)

  return { heroSearchVisible, hasHeroSearch, showNavbarSearch, registerHeroSearch, unregisterHeroSearch, setHeroVisible }
}