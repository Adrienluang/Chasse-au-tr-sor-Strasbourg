export default defineNuxtRouteMiddleware((to) => {
  const { currentCheckpointIndex, isValidated } = useProgression()

  const id = Number(to.params.id)

  if (!Number.isInteger(id) || id < 1 || id > 17) {
    return navigateTo('/map', { replace: true })
  }

  if (!isValidated(id) && id > currentCheckpointIndex.value + 1) {
    return navigateTo('/map', { replace: true })
  }
})
