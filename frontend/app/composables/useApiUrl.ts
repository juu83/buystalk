import { useRuntimeConfig } from '#imports'

export const getApiUrl = () => {
  const {
    public: { APP_ENV, WEBAPI_URL, APPAPI_URL }
  } = useRuntimeConfig()

  const isMobileClient =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (APP_ENV === 'mobile' && isMobileClient) {
    return APPAPI_URL || WEBAPI_URL || 'http://localhost:8000'
  }

  return WEBAPI_URL || APPAPI_URL || 'http://localhost:8000'
}
