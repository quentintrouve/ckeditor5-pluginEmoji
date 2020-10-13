/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import List from '@ckeditor/ckeditor5-list/src/list';
import Link from '@ckeditor/ckeditor5-link/src/link';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';

import Emoji from '../emoji/ckeditor5-emoji';
import { EmojiCategory } from '../emoji/ckeditor5-emoji-category'

//Emoji Plugin

export default class ClassicEditor extends ClassicEditorBase { }

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	Autoformat,
	TextTransformation,
	PasteFromOffice,
	MediaEmbed,
	RemoveFormat,
	Bold,
	Italic,
	Underline,
	Strikethrough,
	Superscript,
	Subscript,
	FontColor,
	Alignment,
	List,
	Link,
	SpecialCharacters,
	Emoji,
	EmojiCategory
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'removeFormat',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'subscript',
			'superscript',
			'fontcolor',
			'|',
			'alignment',
			'bulletedList',
			'numberedList',
			'|',
			'link',
			'specialcharacters',
			'emoji'
		],
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'fr'
};