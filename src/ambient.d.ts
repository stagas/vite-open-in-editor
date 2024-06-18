/// <reference types="ambient-dts" />

module 'open-in-editor' {
  export default {
    configure(opts: {
      editor: string
      dotfiles: string
    }): {
      open(filename: string): Promise<void>
    }
  }
}
