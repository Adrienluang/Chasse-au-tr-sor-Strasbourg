export default defineNuxtRouteMiddleware((to) => {
  const { state } = useProgression()

  const protectedRoutes = ['/map', '/checkpoint', '/fin']
  const isProtected = protectedRoutes.some((r) => to.path.startsWith(r))

  if (isProtected) {
    if (!state.value.onboardingDone) {
      return navigateTo('/onboarding', { replace: true })
    }
    if (!state.value.rgpdAccepted) {
      return navigateTo('/rgpd', { replace: true })
    }
  }

  if (to.path === '/onboarding' && state.value.onboardingDone) {
    if (state.value.rgpdAccepted) {
      return navigateTo('/map', { replace: true })
    }
    return navigateTo('/rgpd', { replace: true })
  }

  if (to.path === '/rgpd' && state.value.rgpdAccepted) {
    return navigateTo('/map', { replace: true })
  }
})
