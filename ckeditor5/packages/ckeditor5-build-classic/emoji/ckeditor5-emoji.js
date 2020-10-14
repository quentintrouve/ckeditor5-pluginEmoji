//For custom plugin
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Typing from '@ckeditor/ckeditor5-typing/src/typing';
import CKEditorError from '@ckeditor/ckeditor5-utils/src/ckeditorerror';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import {
  createDropdown,
  addListToDropdown
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import FormHeaderView from '@ckeditor/ckeditor5-ui/src/formheader/formheaderview';
import View from '@ckeditor/ckeditor5-ui/src/view';

import '../emoji/css/emoji.css';
import '../emoji/css/emojiinfo.css';
import '../emoji/css/emojigrid.css';

import EmojiIcon from '../../ckeditor5-build-classic/emoji/icon/smiley-bw.svg';

//Emoji Plugin

const ALL_EMOJI_GROUP = 'All';

class EmojiNavigationView extends FormHeaderView {
  /**
   * Creates an instance of the {@link module:special-characters/ui/emojinavigationview~EmojiNavigationView}
   * class.
   *
   * @param {module:utils/locale~Locale} locale The localization services instance.
   * @param {Iterable.<String>} groupNames The names of the character groups.
   */
  constructor(locale, groupNames) {
    super(locale);

    const t = locale.t;

    this.set('class', 'ck-special-characters-navigation');

    /**
     * A dropdown that allows selecting a group of special characters to be displayed.
     *
     * @member {module:ui/dropdown/dropdownview~DropdownView}
     */
    this.groupDropdownView = this._createGroupDropdown(groupNames);
    this.groupDropdownView.panelPosition = locale.uiLanguageDirection === 'rtl' ? 'se' : 'sw';

    /**
     * @inheritDoc
     */
    this.label = t('Emojis');

    /**
     * @inheritDoc
     */
    this.children.add(this.groupDropdownView);
  }

  /**
   * Returns the name of the character group currently selected in the {@link #groupDropdownView}.
   *
   * @returns {String}
   */
  get currentGroupName() {
    return this.groupDropdownView.value;
  }

  /**
   * Returns a dropdown that allows selecting character groups.
   *
   * @private
   * @param {Iterable.<String>} groupNames The names of the character groups.
   * @returns {module:ui/dropdown/dropdownview~DropdownView}
   */
  _createGroupDropdown(groupNames) {
    const locale = this.locale;
    const t = locale.t;
    const dropdown = createDropdown(locale);
    const groupDefinitions = this._getCharacterGroupListItemDefinitions(dropdown, groupNames);

    dropdown.set('value', groupDefinitions.first.model.label);

    dropdown.buttonView.bind('label').to(dropdown, 'value');

    dropdown.buttonView.set({
      isOn: false,
      withText: true,
      tooltip: t('Emojis categories'),
      class: ['ck-dropdown__button_label-width_auto']
    });

    dropdown.on('execute', evt => {
      dropdown.value = evt.source.label;
    });

    dropdown.delegate('execute').to(this);

    addListToDropdown(dropdown, groupDefinitions);

    return dropdown;
  }

  /**
   * Returns list item definitions to be used in the character group dropdown
   * representing specific character groups.
   *
   * @private
   * @param {module:ui/dropdown/dropdownview~DropdownView} dropdown
   * @param {Iterable.<String>} groupNames The names of the character groups.
   * @returns {Iterable.<module:ui/dropdown/utils~ListDropdownItemDefinition>}
   */
  _getCharacterGroupListItemDefinitions(dropdown, groupNames) {
    const groupDefs = new Collection();
    for (const name of groupNames) {
      const definition = {
        type: 'button',
        model: new Model({
          label: name,
          withText: true
        })
      };

      definition.model.bind('isOn').to(dropdown, 'value', value => {
        return value === definition.model.label;
      });

      groupDefs.add(definition);
    }

    return groupDefs;
  }
}

class EmojiGridView extends View {
  /**
   * Creates an instance of a character grid containing tiles representing special characters.
   *
   * @param {module:utils/locale~Locale} locale The localization services instance.
   */
  constructor(locale) {
    super(locale);

    /**
     * A collection of the child tile views. Each tile represents a particular character.
     *
     * @readonly
     * @member {module:ui/viewcollection~ViewCollection}
     */
    this.tiles = this.createCollection();

    this.emojiSvgs = this.initEmojis();

    this.setTemplate({
      tag: 'div',
      attributes: {
        class: [
          'ck',
          'ck-character-grid'
        ]
      },
      children: [
        {
          tag: 'div',
          attributes: {
            class: [
              'ck',
              'ck-character-grid__tiles'
            ]
          },
          children: this.tiles
        }
      ],
    });

    /**
     * Fired when any of {@link #tiles grid tiles} is clicked.
     *
     * @event execute
     * @param {Object} data Additional information about the event.
     * @param {String} data.name The name of the tile that caused the event (e.g. "greek small letter epsilon").
     * @param {String} data.character A human-readable character displayed as the label (e.g. "ε").
     */

    /**
     * Fired when a mouse or another pointing device caused the cursor to move onto any {@link #tiles grid tile}
     * (similar to the native `mouseover` DOM event).
     *
     * @event tileHover
     * @param {Object} data Additional information about the event.
     * @param {String} data.name The name of the tile that caused the event (e.g. "greek small letter epsilon").
     * @param {String} data.character A human-readable character displayed as the label (e.g. "ε").
     */
  }

  /**
   * Creates a new tile for the grid.
   *
   * @param {String} character A human-readable character displayed as the label (e.g. "ε").
   * @param {String} name The name of the character (e.g. "greek small letter epsilon").
   * @returns {module:ui/button/buttonview~ButtonView}
   */
  initEmojis() {
    const reqSvgs = require.context('../emoji/svg', false, /\.svg$/);
    const svgs = reqSvgs
      .keys()
      .map(path => ({ path, file: reqSvgs(path) }))

    return svgs;
  }

  getHexCode(character) {
    if (character.length < 4) {
      return character.codePointAt(0).toString(16);
    }
    return character.codePointAt(0).toString(16) + '-' + character.codePointAt(2).toString(16);
  }

  createTile(character, name) {

    const svgs = this.emojiSvgs;

    const hexCode = this.getHexCode(character)

    console.log(hexCode);
    let emojiSvg;

    for (let i = 0; i < svgs.length; i++) {
      let emojiPath = svgs[i].path;
      let truncatePath = emojiPath.replace('./', '').replace('.svg', '');
      if (hexCode == truncatePath) {
        emojiSvg = svgs[i].file.default;
      }
    }

    const tile = new ButtonView(this.locale);

    tile.set({
      label: character,
      icon: emojiSvg,
      //withText: true,
      class: 'ck-character-grid__tile'
    });
    // Labels are vital for the users to understand what character they're looking at.
    // For now we're using native title attribute for that, see #5817.
    tile.extendTemplate({
      attributes: {
        title: name
      },
      on: {
        mouseover: tile.bindTemplate.to('mouseover')
      }
    });
    tile.on('mouseover', () => {
      this.fire('tileHover', { name, character });
    });
    tile.on('execute', () => {
      console.log('before');
      this.fire('execute', { name, character });
    });
    return tile;
  }
}

class EmojiInfoView extends View {
  constructor(locale) {
    super(locale);

    const bind = this.bindTemplate;

    /**
     * The character whose information is displayed by the view. For instance,
     * "∑" or "¿".
     *
     * @observable
     * @member {String|null} #character
     */
    this.set('character', null);

    /**
     * The name of the {@link #character}. For instance,
     * "N-ary summation" or "Inverted question mark".
     *
     * @observable
     * @member {String|null} #name
     */
    this.set('name', null);

    /**
     * The "Unicode string" of the {@link #character}. For instance,
     * "U+0061".
     *
     * @observable
     * @readonly
     * @member {String} #code
     */
    this.bind('code').to(this, 'character', characterToUnicodeString);

    this.setTemplate({
      tag: 'div',
      children: [
        {
          tag: 'span',
          attributes: {
            class: [
              'ck-character-info__name'
            ]
          },
          children: [
            {
              // Note: ZWSP to prevent vertical collapsing.
              text: bind.to('name', name => name ? name : '\u200B')
            }
          ]
        },
        {
          tag: 'span',
          attributes: {
            class: [
              'ck-character-info__code'
            ]
          },
          children: [
            {
              text: bind.to('code')
            }
          ]
        }
      ],
      attributes: {
        class: [
          'ck',
          'ck-character-info'
        ]
      }
    });
  }
}

function characterToUnicodeString(character) {
  if (character === null) {
    return '';
  }

  const hexCode = character.codePointAt(0).toString(16);

  return 'U+' + ('0000' + hexCode).slice(-4);
}

/*@extend Plugin*/
export default class Emoji extends Plugin {

  static get requires() {
    return [Typing];
  }

  static get pluginName() {
    return 'Emoji';
  }

  constructor(editor) {
    super(editor);

    /**
     * Registered characters. A pair of a character name and its symbol.
     *
     * @private
     * @member {Map.<String, String>} #_characters
     */
    this._characters = new Map();

    /**
     * Registered groups. Each group contains a collection with symbol names.
     *
     * @private
     * @member {Map.<String, Set.<String>>} #_groups
     */
    this._groups = new Map();
  }

  init() {
    const editor = this.editor;
    const t = editor.t;

    const inputCommand = editor.commands.get('input');

    // Add the `specialCharacters` dropdown button to feature components.
    editor.ui.componentFactory.add('emoji', locale => {
      const dropdownView = createDropdown(locale);
      let dropdownPanelContent;

      dropdownView.buttonView.set({
        label: t('Emoji'),
        icon: EmojiIcon,
        tooltip: true
      });

      dropdownView.bind('isEnabled').to(inputCommand);

      // Insert a special character when a tile was clicked.
      dropdownView.on('execute', (evt, data) => {
        editor.execute('input', { text: data.character });
        editor.editing.view.focus();
      });

      dropdownView.on('change:isOpen', () => {
        if (!dropdownPanelContent) {
          dropdownPanelContent = this._createDropdownPanelContent(locale, dropdownView);

          dropdownView.panelView.children.add(dropdownPanelContent.navigationView);
          dropdownView.panelView.children.add(dropdownPanelContent.gridView);
          dropdownView.panelView.children.add(dropdownPanelContent.infoView);
        }

        dropdownPanelContent.infoView.set({
          character: null,
          name: null
        });
      });

      return dropdownView;
    });
  }

  /**
   * Adds a collection of special characters to the specified group. The title of a special character must be unique.
   *
   * **Note:** The "All" category name is reserved by the plugin and cannot be used as a new name for a special
   * characters category.
   *
   * @param {String} groupName
   * @param {Array.<module:emoji/emoji~EmojiDefinition>} items
   */
  addItems(groupName, items) {
    if (groupName === ALL_EMOJI_GROUP) {
      /**
       * The name "All" for a special category group cannot be used because it is a special category that displays all
       * available special characters.
       *
       * @error special-character-invalid-group-name
       */
      throw new CKEditorError(
        `special-character-invalid-group-name: The name "${ALL_EMOJI_GROUP}" is reserved and cannot be used.`
      );
    }

    const group = this._getGroup(groupName);
    console.log(group);
    for (const item of items) {
      group.add(item.title);
      this._characters.set(item.title, item.character);
    }
  }

  /**
   * Returns an iterator of special characters groups.
   *
   * @returns {Iterable.<String>}
   */
  getGroups() {
    return this._groups.keys();
  }

  /**
   * Returns a collection of special characters symbol names (titles).
   *
   * @param {String} groupName
   * @returns {Set.<String>|undefined}
   */
  getCharactersForGroup(groupName) {
    if (groupName === ALL_EMOJI_GROUP) {
      return new Set(this._characters.keys());
    }

    return this._groups.get(groupName);
  }

  /**
   * Returns the symbol of a special character for the specified name. If the special character could not be found, `undefined`
   * is returned.
   *
   * @param {String} title The title of a special character.
   * @returns {String|undefined}
   */
  getCharacter(title) {
    return this._characters.get(title);
  }

  /**
   * Returns a group of special characters. If the group with the specified name does not exist, it will be created.
   *
   * @private
   * @param {String} groupName The name of the group to create.
   */
  _getGroup(groupName) {
    if (!this._groups.has(groupName)) {
      this._groups.set(groupName, new Set());
    }

    return this._groups.get(groupName);
  }

  /**
   * Updates the symbol grid depending on the currently selected character group.
   *
   * @private
   * @param {String} currentGroupName
   * @param {module:emoji/ui/emojigridview~EmojiGridView} gridView
   */
  _updateGrid(currentGroupName, gridView) {
    // Updating the grid starts with removing all tiles belonging to the old group.
    gridView.tiles.clear();

    const characterTitles = this.getCharactersForGroup(currentGroupName);

    for (const title of characterTitles) {
      const character = this.getCharacter(title);

      gridView.tiles.add(gridView.createTile(character, title));
    }
  }

  /**
   * Initializes the dropdown, used for lazy loading.
   *
   * @private
   * @param {module:utils/locale~Locale} locale
   * @param {module:ui/dropdown/dropdownview~DropdownView} dropdownView
   * @returns {Object} Returns an object with `navigationView`, `gridView` and `infoView` properties, containing UI parts.
   */
  _createDropdownPanelContent(locale, dropdownView) {
    const specialCharsGroups = [...this.getGroups()];

    // Add a special group that shows all available special characters.
    specialCharsGroups.unshift(ALL_EMOJI_GROUP);

    const navigationView = new EmojiNavigationView(locale, specialCharsGroups);
    const gridView = new EmojiGridView(locale);
    const infoView = new EmojiInfoView(locale);

    gridView.delegate('execute').to(dropdownView);

    gridView.on('tileHover', (evt, data) => {
      infoView.set(data);
    });

    // Update the grid of special characters when a user changed the character group.
    navigationView.on('execute', () => {
      this._updateGrid(navigationView.currentGroupName, gridView);
    });

    // Set the initial content of the special characters grid.
    this._updateGrid(navigationView.currentGroupName, gridView);

    return { navigationView, gridView, infoView };
  }
}