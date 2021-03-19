import CharacterRollDialog from "../dialogs/character-roll.js";
import ActorEntity from "../entities/actor.js";

export default class ActorSheetCharacter extends ActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(
			super.defaultOptions,
			{
				classes: ["window-gqq"],
				height: 601,
				width: 905,
				template: 'systems/quickquest/templates/sheets/character.html',
				resizable: false,
				tabs: [{navSelector: ".tabs__nav", contentSelector: ".tabs__body", initial: "attributes"}]
			}
		);
	}

	activateListeners(html) {
		if ( this.isEditable ) {   
			html.find('.item__action--add').click(this._onItemAdd.bind(this));
			html.find('.item__action--toggle-equipped').click(this._onItemToggleEquipped.bind(this));
			html.find('.item__action--toggle-hidden').click(this._onItemToggleHidden.bind(this));
			html.find('.item .item__icon img, .item .item__title, .item__action--edit').click(this._onItemEdit.bind(this));
			html.find('.item__action--delete').click(this._onItemDelete.bind(this));
			html.find('.attributes .attribute__tag').click(this._onMakeRoll.bind(this));
		}
		super.activateListeners(html);
	}

	_onItemAdd(event) {
		event.preventDefault();
		const header = event.currentTarget;
		const type = "item";
		const itemData = {
			name: game.i18n.format("sheet.character.inventory.new.item"),
			img: DEFAULT_TOKEN,
			type: type,
			data: duplicate(header.dataset)
		};
		delete itemData.data["type"];
		return this.actor.createEmbeddedEntity("OwnedItem", itemData);
	}

	_onItemToggleEquipped(event) {
		event.preventDefault();
		const li = event.currentTarget.closest(".item");
		const item = this.actor.getOwnedItem(li.dataset.itemId);
		item.update({
			"data.isEquipped": !item.data.data.isEquipped
		});
	}

	_onItemToggleHidden(event) {
		event.preventDefault();
		const li = event.currentTarget.closest(".item");
		const item = this.actor.getOwnedItem(li.dataset.itemId);
		item.update({
			"data.isHidden": !item.data.data.isHidden
		});
	}

	_onItemEdit(event) {
		event.preventDefault();
		const li = event.currentTarget.closest(".item");
		const item = this.actor.getOwnedItem(li.dataset.itemId);
		item.sheet.render(true);
	}

	_onItemDelete(event) {
		event.preventDefault();
		const li = event.currentTarget.closest(".item");
		this.actor.deleteOwnedItem(li.dataset.itemId);
	}

	async _onMakeRoll(event) {
		event.preventDefault();
		let preselectedAttribute = event.currentTarget.closest(".attribute").getAttribute("data-attribute");
		try {
			let form = await CharacterRollDialog.characterRollDialog({preselectedAttribute: preselectedAttribute});
			let rollParts = [];
			let message = '';
			console.log(form);
			if (form.attribute) {
				rollParts.push(this.actor.data.data.attributes[form.attribute].total);
				message = game.i18n.format(`common.${form.attribute}.name`);
			}
			if (form.archetype) {
				rollParts.push(this.actor.data.data.archetypes[form.archetype].total);
				if (message == '') {
					message = game.i18n.format(`common.${form.archetype}.name`);
				} else {
					message += ` (${game.i18n.format(`common.${form.archetype}.name`)})`;
				}
			}
			if (form.bonus) {
				rollParts.push(form.bonus);
			}
			switch (form.advantage) {
				case "advantage":
					rollParts.unshift("2d20kh");
					message += `, advantage`;
					break;
				case "disadvantage":
					rollParts.unshift("2d20kl");
					message += `, disadvantage`;
					break;
				default: 
					rollParts.unshift("1d20");
					break;
			}
			const roll = new Roll(rollParts.join(" + ")).roll();
			roll.toMessage({
			  speaker: ChatMessage.getSpeaker({actor: this.actor}),
			  flavor: message,
			  messageData: {"flags.dnd5e.roll": {type: "other", itemId: this.id }},
			  rollMode: form.mode
			});
		} catch(err) {
			console.log(err);
			return;
		}
	}
}
