interface RestCountries {
  names: { common: string }
  codes: { alpha_2: string }
  capitals: { name: string }[]
  flag: { url_svg: string; url_png: string; emoji: string }
  region: string
  population: number
  languages: { name: string }[]
  calling_codes: string[]
}

interface RestCountriesResponse {
  data: {
    objects: RestCountries[]
    meta: { more: boolean }
  }
}

// Free plan caps each request at 100 objects; the full dataset is 254, so we page through it.
const PAGE_LIMIT = 100

export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig(event)

    const all: RestCountries[] = []
    let offset = 0
    let more = true

    while (more) {
      const response = await $fetch<RestCountriesResponse>(
        'https://api.restcountries.com/countries/v5',
        {
          headers: {
            Authorization: `Bearer ${config.restCountriesApiKey}`
          },
          query: {
            limit: PAGE_LIMIT,
            offset,
            response_fields:
              'names.common,codes.alpha_2,capitals.name,flag.url_svg,flag.emoji,region,population,languages.name,calling_codes'
          }
        }
      )

      all.push(...response.data.objects)
      more = response.data.meta.more
      offset += PAGE_LIMIT
    }

    return all
      .filter((country) => country.codes?.alpha_2)
      .map((country) => ({
        name: country.names.common,
        cca2: country.codes.alpha_2,
        capital: country.capitals?.[0]?.name ?? '',
        flagUrl: country.flag?.url_svg ?? '',
        flagEmoji: country.flag?.emoji ?? '',
        region: country.region,
        population: country.population,
        languages: (country.languages ?? []).map((language) => language.name),
        callingCode: country.calling_codes?.[0] ? `+${country.calling_codes[0]}` : ''
      }))
  },
  // Cached response is shared across all requests hitting this server process, not per-user
  // keeps this well under the 1000 req/month free-tier quota (3 upstream calls per 6h, not per visit).
  { maxAge: 60 * 60 * 6 }
)
