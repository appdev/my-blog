import { visit } from 'unist-util-visit'

// Fetch the public gallery file directly. GitHub's blob-page redirect can
// return 503 to build-time image dimension requests.
export function remarkGalleryRawImages() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      let url
      try {
        url = new URL(node.url)
      }
      catch {
        return
      }
      const prefix = '/appdev/gallery/blob/main/'
      if (url.origin !== 'https://github.com' || url.username || url.password
        || !url.pathname.startsWith(prefix) || url.searchParams.get('raw') !== 'true') {
        return
      }
      const raw = new URL('https://raw.githubusercontent.com')
      raw.pathname = url.pathname.replace(prefix, '/appdev/gallery/main/')
      node.url = raw.href
    })
  }
}
