import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { useCallback } from 'react';
import { uploadToImgBB } from '../../lib/imgbb';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
    Heading1, Heading2, Heading3, List, ListOrdered, Quote,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Link as LinkIcon, Image as ImageIcon, Undo, Redo, Minus,
    Subscript as SubIcon, Superscript as SuperIcon
} from 'lucide-react';

const MenuButton = ({ onClick, isActive, disabled, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded-md transition-all ${isActive
            ? 'bg-purple-100 text-purple-700 shadow-sm ring-1 ring-purple-500/20'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

const MenuBar = ({ editor, addImage }) => {
    if (!editor) return null;

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <div className="sticky top-16 md:top-0 z-20 bg-white border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center rounded-t-lg">

            {/* History */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Geri Al">
                    <Undo size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="İleri Al">
                    <Redo size={18} />
                </MenuButton>
            </div>

            {/* Typography */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Kalın">
                    <Bold size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="İtalik">
                    <Italic size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Altı Çizili">
                    <UnderlineIcon size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Üstü Çizili">
                    <Strikethrough size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Kod">
                    <Code size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} title="Alt Simge">
                    <SubIcon size={14} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} title="Üst Simge">
                    <SuperIcon size={14} />
                </MenuButton>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Başlık 1">
                    <Heading1 size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Başlık 2">
                    <Heading2 size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Başlık 3">
                    <Heading3 size={18} />
                </MenuButton>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Sola Hizala">
                    <AlignLeft size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Ortala">
                    <AlignCenter size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Sağa Hizala">
                    <AlignRight size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="İki Yana Yasla">
                    <AlignJustify size={18} />
                </MenuButton>
            </div>

            {/* Lists & Indent */}
            <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
                <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Madde İşaretli Liste">
                    <List size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numaralı Liste">
                    <ListOrdered size={18} />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Alıntı">
                    <Quote size={18} />
                </MenuButton>
            </div>

            {/* Insert */}
            <div className="flex items-center gap-0.5">
                <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Bağlantı Ekle">
                    <LinkIcon size={18} />
                </MenuButton>
                <label className="cursor-pointer p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center" title="Resim Ekle">
                    <ImageIcon size={18} />
                    <input type="file" className="hidden" accept="image/*" onChange={addImage} />
                </label>
                <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Ayırıcı Çizgi">
                    <Minus size={18} />
                </MenuButton>
            </div>

        </div>
    );
};

const extensions = [
    StarterKit.configure({
        heading: { levels: [1, 2, 3] },
    }),
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-purple-600 underline cursor-pointer',
        },
    }),
    Image.configure({
        HTMLAttributes: {
            class: 'rounded-lg max-h-[500px] object-contain mx-auto',
        },
    }),
    Underline,
    Subscript,
    Superscript,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
        placeholder: 'İçeriğinizi buraya yazın...',
    }),
];

export default function TiptapEditor({ content, targetInputId }) {
    const editor = useEditor({
        extensions,
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[400px] p-6 max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            if (targetInputId) {
                const input = document.getElementById(targetInputId);
                // Also trigger input event for validation watchers
                if (input) {
                    input.value = editor.getHTML();
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        },
    });

    const addImage = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Determine previous text to avoid replacing it
                // Actually chain focuses so it should insert at cursor

                // Show uploading state if possible, but for now simple sync
                const url = await uploadToImgBB(file);
                if (url && editor) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            } catch (error) {
                alert('Resim yüklenirken hata oluştu: ' + error.message);
            }
        }
        e.target.value = '';
    }, [editor]);

    // External Content Loader
    if (typeof window !== 'undefined' && editor && targetInputId) {
        window.addEventListener('set-tiptap-content', (e) => {
            const newContent = e.detail;
            if (newContent !== undefined && editor) {
                // Only update if different to avoid cursor jumps / loops if used bidirectionally
                if (editor.getHTML() !== newContent) {
                    editor.commands.setContent(newContent);
                    const input = document.getElementById(targetInputId);
                    if (input) input.value = newContent;
                }
            }
        });
    }

    console.log("TiptapEditor Rendered", { editor });

    return (
        <div className="border rounded-xl border-gray-300 shadow-sm bg-white w-full overflow-hidden flex flex-col min-h-[400px]">
            <MenuBar editor={editor} addImage={addImage} />
            <div className="flex-1 bg-white cursor-text min-h-[300px]" onClick={() => editor?.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
