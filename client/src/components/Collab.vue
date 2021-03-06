<template lang="pug">
  div(class="editor")
    h2 Using socket.io on {{address}}
    template(v-if="editor && !loading")
      div(class="count") {{ count }} {{ count === 1 ? 'user' : 'users' }} connected
      editor-content(class="editor-content", :editor="editor")
    em(v-else) Connecting to socket server …
    div {{ newContent }}
</template>

<script>
import io from 'socket.io-client'
import { Editor, EditorContent } from 'tiptap'
import {
  HardBreak,
  Heading,
  Bold,
  Code,
  Italic,
  History,
  Collaboration,
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
  },

  data () {
    return {
      loading: true,
      editor: null,
      socket: null,
      address: null,
      theDoc: {},
      count: 0,
      newContent: ''
    }
  },

  methods: {
    onInit ({ doc, version }) {
      this.loading = false
      this.theDoc = doc
      if (this.editor) {
        this.editor.destroy()
      }

      this.editor = new Editor({
        content: doc,
        extensions: [
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Bold(),
          new Code(),
          new Italic(),
          new History(),
          new Collaboration({
            // the initial version we start with
            // version is an integer which is incremented with every change
            version,
            // debounce changes so we can save some requests
            debounce: 250,
            // onSendable is called whenever there are changed we have to send to our server
            onSendable: ({ sendable }) => {
              console.log('send sendable', sendable)
              this.socket.emit('update', sendable)
            },
          }),
        ],
      })

      this.editor.on('update', ({ getHTML }) => {
        this.newContent = this.editor.getJSON()
        console.log('got new content on update', JSON.stringify(this.newContent, null, 2))
      })

    },

    setCount (count) {
      this.count = count
    },
  },

  mounted () {

    this.address = 'http://localhost:3007/'
    this.socket = io(this.address)
      // get the current document and its version
      .on('init', data => this.onInit(data))
      // send all updates to the collaboration extension
      .on('update', data => {
        console.log('recieve update event with data', data)
        this.theDoc = data
        try {
          this.editor.extensions.options.collaboration.update(data)
        } catch (error) {
          console.log('Update failed', error.message)
        }
      })
      // get count of connected users
      .on('getCount', count => this.setCount(count))
  },

  beforeDestroy () {
    this.editor.destroy()
    this.socket.destroy()
  },
}
</script>

<style lang="scss">
  $color-black: #000000;
  $color-white: #ffffff;
  $color-grey: #dddddd;

  .count {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: rgba($color-black, 0.5);
    color: #27b127;
    margin-bottom: 1rem;
    text-transform: uppercase;
    font-size: 0.7rem;
    line-height: 1;

    &:before {
      content: '';
      display: inline-flex;
      background-color: #27b127;
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
      margin-right: 0.3rem;
    }
  }
    .editor-content {
      border: 1px solid black;
      height: 10rem;
      overflow-y: auto;

      .ProseMirror {
        padding: 5px;
      }

      p {
        margin: 0;
        padding: 0;
      }
    }

</style>
