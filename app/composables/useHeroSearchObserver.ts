export const useHeroSearchObserver = (targetRef: Ref<HTMLElement | null>) => {
  const { registerHeroSearch, unregisterHeroSearch, setHeroVisible } = useNavbarSearch()

  onMounted(() => {
    if (!targetRef.value) return

    registerHeroSearch()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setHeroVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
      }
    )

    observer.observe(targetRef.value)

    onUnmounted(() => {
      observer.disconnect()
      unregisterHeroSearch()
    })
  })
}