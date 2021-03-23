import EditItemDialog from "../dialogs/edit-item.js";

export default class ItemSheetItem extends ItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(
			super.defaultOptions,
			{
				classes: ["window-gqq"],
				height: 601,
				width: 350,
				template: 'systems/quickquest/templates/sheets/item.html',
				resizable: false,
				tabs: [{navSelector: ".card__tabs__nav", contentSelector: ".card__tabs__body", initial: "front"}]
			}
		);
	}

	/** @override */
    getData() {
        const data = super.getData();
        data.item.data.showExtras = data.item.data.canHaveQuantity || data.item.data.canHaveBulk || data.item.data.canHaveValue;
		data.item.data.extrasCount = data.item.data.canHaveQuantity + data.item.data.canHaveBulk + data.item.data.canHaveValue;
        return data;
    }

	activateListeners(html) {
		html.find('button[data-action="edit"]').click(this._onItemEdit.bind(this));
		html.find('.item__equipped').click(ev => this._onToggleEquipped(ev));
		html.find('.item__extra--quantity input').change(ev => this._onUpdateQuantity(ev.target.value));
		html.find('.item__extra--value input').change(ev => this._onUpdateValue(ev.target.value));
		html.find('.item__extra--bulk input').change(ev => this._onUpdateBulk(ev.target.value));
		super.activateListeners(html);
	}

	_onUpdateValue(value) {
		this.item.update({
			"data.value": value
		});
	}

	_onUpdateQuantity(quantity) {
		this.item.update({
			"data.quantity": quantity
		});
	}

	_onUpdateBulk(bulk) {
		this.item.update({
			"data.bulk": bulk
		});
	}

	_onToggleEquipped() {
		this.item.update({
			"data.isEquipped": !this.item.data.data.isEquipped
		});
	}

	async _onItemEdit(event) {
		event.preventDefault();
		try {
			let form = await EditItemDialog.editItemDialog({item: this.item.data});
			await this.item.update(form);
		} catch(err) {
			return;
		}
	}
}
