<template lang="pug">
  div WYSIWYG editor:
    div newContent: {{newContent}}
    editor-menu-bar(:editor="editor", v-slot="{ commands, isActive }")
      div(class="menubar")
        button(class="menubar__button", :class="{ 'is-active': isActive.bold() }", @click="commands.bold")
          span B
        button(class="menubar__button", :class="{ 'is-active': isActive.italic() }", @click="commands.italic")
          span I
    editor-content(:editor="editor", class="editor-content")

</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {   Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  History, } from 'tiptap-extensions'

const editor = new Editor({
  content: '<p>This editor now should have a menu bar</p>',
  extensions: [
    new Blockquote(),
    new BulletList(),
    new CodeBlock(),
    new HardBreak(),
    new Heading({ levels: [1, 2, 3] }),
    new ListItem(),
    new OrderedList(),
    new TodoItem(),
    new TodoList(),
    new Bold(),
    new Code(),
    new Italic(),
    new Link(),
    new History(),
  ]
})

export default {
  name: 'wysiwyg',
  components: {
    EditorContent, EditorMenuBar
  },
  data () {
    return {
      editor: editor,
      newContent:''
    }
  },
  mounted () {
    const _this = this
    editor.on('init', () => {
      // editor is initialized
    })

    editor.on('update', ({ getHTML }) => {
      // get new content on update
      _this.newContent = _this.editor.getHTML()
    })
    this.editor = editor
  },
  beforeDestroy () {
  // Always destroy your editor instance when it's no longer needed
    this.editor.destroy()
  },
}

/*
 <button
 class="menubar__button"
 :class="{ 'is-active': isActive.paragraph() }"
 @click="commands.paragraph"
 >
 <icon name="paragraph" />
 </button>

 <button
 class="menubar__button"
 :class="{ 'is-active': isActive.heading({ level: 1 }) }"
 @click="commands.heading({ level: 1 })"
 >
 H1
 </button>

 <button
 class="menubar__button"
 :class="{ 'is-active': isActive.heading({ level: 2 }) }"
 @click="commands.heading({ level: 2 })"
 >
 H2
 </button>

 <button
 class="menubar__button"
 :class="{ 'is-active': isActive.heading({ level: 3 }) }"
 @click="commands.heading({ level: 3 })"
 >
 H3
 </button>

 <button
 class="menubar__button"
 :class="{ 'is-active': isActive.bullet_list() }"
 @click="commands.bullet_list"
 >
 <icon name="ul" />
 </button>

 <button
 class="menubar__button"
 :class="{ 'is-active': isActive.ordered_list() }"
 @click="commands.ordered_list"
 >
 <icon name="ol" />
 </button>

 <button
 class="menubar__button"
 :class="{ 'is-active': isActive.blockquote() }"
 @click="commands.blockquote"
 >
 <icon name="quote" />
 </button>

 <button
 class="menubar__button"
 :class="{ 'is-active': isActive.code_block() }"
 @click="commands.code_block"
 >
 <icon name="code" />
 </button>

 <button
 class="menubar__button"
 @click="commands.horizontal_rule"
 >
 <icon name="hr" />
 </button>

 <button
 class="menubar__button"
 @click="commands.undo"
 >
 <icon name="undo" />
 </button>

 <button
 class="menubar__button"
 @click="commands.redo"
 >
 <icon name="redo" />
 </button>

 </div>
 </editor-menu-bar>
 */

</script>

<style scoped>

.editor-content {
  text-align: left;
}
</style>
