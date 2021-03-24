import EditPerkDialog from "../dialogs/edit-perk.js";

export default class ItemSheetPerk extends ItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(
			super.defaultOptions,
			{
				classes: ["window-gqq"],
				height: 601,
				width: 350,
				template: 'systems/quickquest/templates/sheets/perk.html',
				resizable: false,
				tabs: [{navSelector: ".card__tabs__nav", contentSelector: ".card__tabs__body", initial: "front"}]
			}
		);
	}

	/** @override */
    getData() {
        const data = super.getData();
        return data;
    }

	activateListeners(html) {
		html.find('button[data-action="edit"]').click(this._onPerkEdit.bind(this));
		super.activateListeners(html);
	}

	async _onPerkEdit(event) {
		event.preventDefault();
		try {
			let form = await EditPerkDialog.editPerkDialog({item: this.item.data});
			await this.item.update(form);
		} catch(err) {
			return;
		}
	}
}
