import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image"; // For image insertion
import Youtube from "@tiptap/extension-youtube"; // For YouTube insertion
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { FaImage, FaYoutube } from "react-icons/fa";

const TextEditor = ({ content, setContent }) => {
 const { colors, darkMode: isDark } = useTheme();
 const editor = useEditor({
  extensions: [
   StarterKit.configure({
    // Disable the keymap for Enter to prevent automatic form submission
    keymap: {
     enter: () =>
      editor?.commands.first(({ commands }) => [
       () => commands.newlineInCode(),
       () => commands.createParagraphNear(),
       () => commands.liftEmptyBlock(),
       () => commands.splitBlock(),
      ]),
    },
   }),
   Underline,
   Color,
   TextStyle.configure({ mergeNestedSpanStyles: true }),
   TextAlign.configure({
    types: ["paragraph", "heading"],
   }),
   Image,
   Youtube,
   Highlight.configure({ multicolor: true }),
  ],
  content,
  onUpdate: ({ editor }) => {
   setContent(editor.getHTML());
  },
 });

 useEffect(() => {
  if (editor && content !== editor.getHTML()) {
   editor.commands.setContent(content);
  }
 }, [content, editor]);

 if (!editor) return null;

 const handleButtonClick = (e, action) => {
  e.preventDefault();
  action();
 };

 return (
  <div
   style={{
    backgroundColor: isDark
     ? colors.dark.primaryBackground
     : colors.light.primaryBackground,
   }}
   className=" p-3 rounded-lg editor-content"
  >
   {/* Toolbar */}
   <div className="mb-2 flex gap-1 flex-wrap">
    {/* Bold, Italic, Underline */}
    <button
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     onClick={(e) =>
      handleButtonClick(e, () => editor.chain().focus().toggleBold().run())
     }
     className={`p-1 px-2 rounded-md text-white ${
      editor.isActive("bold") ? "opacity-100" : "opacity-70"
     }`}
    >
     B
    </button>
    <button
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     onClick={(e) =>
      handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())
     }
     className={`p-1 px-2 rounded-md text-white ${
      editor.isActive("italic") ? "opacity-100" : "opacity-70"
     }`}
    >
     I
    </button>
    <button
     onClick={(e) =>
      handleButtonClick(e, () => editor.chain().focus().toggleUnderline().run())
     }
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className={`p-1 px-2 rounded-md text-white ${
      editor.isActive("underline") ? "opacity-100" : "opacity-70"
     }`}
    >
     U
    </button>

    {/* Heading Selection */}
    <select
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className="p-1 px-2 rounded-md text-white opacity-70"
     onChange={(e) => {
      const level = parseInt(e.target.value, 10);
      editor.chain().focus().toggleHeading({ level }).run();
     }}
    >
     <option value="4">Paragraph</option>
     <option value="1">Heading 1</option>
     <option value="2">Heading 2</option>
     <option value="3">Heading 3</option>
    </select>

    {/* Text Color */}
    <input
     type="color"
     onChange={(e) =>
      handleButtonClick(e, () =>
       editor.chain().focus().setColor(e.target.value).run()
      )
     }
     className="h-8 w-8"
    />

    {/* Text Alignment */}
    <button
     onClick={(e) =>
      handleButtonClick(e, () =>
       editor.chain().focus().setTextAlign("left").run()
      )
     }
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className={`p-1 px-2 rounded-md text-white ${
      editor.isActive({ textAlign: "left" }) ? "opacity-100" : "opacity-70"
     }`}
    >
     Left
    </button>
    <button
     onClick={(e) =>
      handleButtonClick(e, () =>
       editor.chain().focus().setTextAlign("center").run()
      )
     }
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className={`p-1 px-2 rounded-md text-white ${
      editor.isActive({ textAlign: "center" }) ? "opacity-100" : "opacity-70"
     }`}
    >
     Center
    </button>
    <button
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     onClick={(e) =>
      handleButtonClick(e, () =>
       editor.chain().focus().setTextAlign("right").run()
      )
     }
     className={`p-1 px-2 rounded-md text-white ${
      editor.isActive({ textAlign: "right" }) ? "opacity-100" : "opacity-70"
     }`}
    >
     Right
    </button>

    {/* Horizontal Line */}
    <button
     onClick={(e) =>
      handleButtonClick(e, () =>
       editor.chain().focus().setHorizontalRule().run()
      )
     }
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className="p-1 px-2 rounded-md text-white opacity-70"
    >
     Line
    </button>

    {/* Insert Image */}
    <button
     onClick={(e) => {
      e.preventDefault();
      const url = prompt("ادخل رابط الصورة:");
      if (url) {
       editor.chain().focus().setImage({ src: url }).run();
      }
     }}
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className="p-1 px-2 rounded-md text-white opacity-70"
    >
     <FaImage size={18} />
    </button>

    {/* Insert Video (YouTube) */}
    <button
     onClick={(e) => {
      e.preventDefault();
      const url = prompt("ادخل رابط الفيديو على اليوتيوب:");
      if (url) {
       editor.chain().focus().setYoutubeVideo({ src: url }).run();
      }
     }}
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className="p-1 px-2 rounded-md text-white opacity-70"
    >
     <FaYoutube size={18} />
    </button>

    {/* List options */}
    <button
     onClick={(e) =>
      handleButtonClick(e, () =>
       editor.chain().focus().toggleBulletList().run()
      )
     }
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className={`p-1 px-2 rounded-md text-white ${
      editor.isActive("bulletList") ? "opacity-100" : "opacity-70"
     }`}
    >
     UL
    </button>
    <button
     onClick={(e) =>
      handleButtonClick(e, () =>
       editor.chain().focus().toggleOrderedList().run()
      )
     }
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className={`p-1 px-2 rounded-md text-white ${
      editor.isActive("orderedList") ? "opacity-100" : "opacity-70"
     }`}
    >
     OL
    </button>
    <button
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     onClick={(e) =>
      handleButtonClick(e, () =>
       editor.chain().focus().toggleHighlight({ color: "#ffa8a8" }).run()
      )
     }
     className={`p-1 px-2 rounded-md text-white 
     ${
      editor.isActive("highlight", { color: "#ffa8a8" })
       ? "opacity-100"
       : "opacity-70"
     }
     `}
    >
     Red
    </button>
   </div>

   {/* Editor Content */}
   <EditorContent
    editor={editor}
    className="min-h-[250px] border p-2 rounded-md"
    style={{ overflow: "auto" }}
   />
  </div>
 );
};

export default TextEditor;
