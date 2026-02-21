export default defineNuxtRouteMiddleware(() => {
  const { isFinished } = useProgression()

  if (!isFinished.value) {
    return navigateTo('/map', { replace: true })
  }
})
