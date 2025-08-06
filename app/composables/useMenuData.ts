import type { Restaurant } from '~/types'

export type AggregatedMenu = Record<string, Restaurant[]>

export const useMenuData = () => {
  const menuModules = import.meta.glob<Restaurant>('../assets/data/**/*.json', {
    eager: true,
    import: 'default'
  })
  const aggregatedMenu = Object.entries(menuModules).reduce<AggregatedMenu>((acc, [path, data]) => {
    const pathParts = path.split('/')
    const category = pathParts[pathParts.length - 2]
    if (!category) return acc

    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(data)
    return acc
  }, {})
  return {
    data: aggregatedMenu
  }
}
