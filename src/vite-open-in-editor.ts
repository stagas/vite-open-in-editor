import os from 'node:os'
import path from 'node:path'
import createEditor from 'open-in-editor'
import type { Plugin } from 'vite'

export function openInEditor(): Plugin {
  const editor = createEditor.configure({
    editor: 'code',
    dotfiles: 'allow',
  })

  return {
    name: 'open-in-editor',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method === 'POST') {
          const fsPath = req.url!.slice(1).replace('@fs', '')
          const homedir = os.homedir()

          let filename: string
          if (fsPath.startsWith(homedir)) {
            filename = fsPath
          }
          else {
            filename = path.join(process.cwd(), fsPath)
          }
          try {
            console.log('[info] opening file in editor: ' + filename)
            await editor.open(filename)
          }
          catch (error) {
            res.writeHead(500)
            res.end((error as Error).message)
            return
          }
          res.writeHead(200, {
            'content-type': 'text/html'
          })
          res.end('<script>window.close()</script>')
          return
        }
        next()
      })
    },
  }
}
