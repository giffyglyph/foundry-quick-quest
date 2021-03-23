/**
 * A helper Dialog subclass for completing a long rest
 * @extends {Dialog}
 */
export default class EditItemDialog extends Dialog {
	constructor(item, dialogData = {}, options = {}) {
		super(dialogData, options);
		this.item = item;
	}

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			template: "systems/quickquest/templates/dialogs/edit-item.html",
			classes: ["window-gqq"],
			width: 450,
			height: 660,
			resizable: false
		});
	}

	/** @override */
	getData() {
		const data = super.getData();
		data.item = this.item;
		return data;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);
		html.find('[data-action="set-icon"]').click(ev => this._onEditIcon(ev));
		html.find('[data-action="add-tag"]').click(ev => this._onAddTag(html.find('.tags')[0]));
		html.find('[data-action="add-modifier"]').click(ev => this._onAddModifier(html.find('.modifiers')[0]));
		html.find('.tags').click(ev => this._onClickTags(ev));
		html.find('.modifiers').click(ev => this._onClickModifiers(ev));
		const tabs = new Tabs({
			navSelector: ".dialog__tabs__nav",
			contentSelector: ".dialog__tabs__body",
			initial: "core"
		});
		tabs.bind(html[0]);
	}

	_onClickTags(e) {
		let button = e.target.closest("button");
		if (button) {
			let action = button.getAttribute("data-action");
			let row = button.closest(".input-group");
			switch (action) {
				case "move-tag-up":
					if (row.previousElementSibling) {
						row.parentNode.insertBefore(row, row.previousElementSibling);
					}
					break;
				case "move-tag-down":
					if (row.nextElementSibling) {
						row.parentNode.insertBefore(row.nextElementSibling, row);
					}
					break;
				case "delete-tag":
					row.remove();
					break;
			}
		}
	}

	_onAddTag(element) {
		element.insertAdjacentHTML('beforeend', `
			<div class="input-group">
				<input name="data.tags[]" type="text" value=""/>
				<div class="input-group-append">
				<button type="button" data-action="move-tag-up"><i class="fa fa-arrow-up"></i></button>
				<button type="button" data-action="move-tag-down"><i class="fa fa-arrow-down"></i></button>
				<button type="button" data-action="delete-tag"><i class="fa fa-trash"></i></button>
				</div>
			</div>
    	`);
	}

	_onClickModifiers(e) {
		let button = e.target.closest("button");
		if (button) {
			let action = button.getAttribute("data-action");
			let row = button.closest(".input-group");
			switch (action) {
				case "move-modifier-up":
					if (row.previousElementSibling) {
						row.parentNode.insertBefore(row, row.previousElementSibling);
					}
					break;
				case "move-modifier-down":
					if (row.nextElementSibling) {
						row.parentNode.insertBefore(row.nextElementSibling, row);
					}
					break;
				case "delete-modifier":
					row.remove();
					break;
			}
		}
	}

	_onAddModifier(element) {
		element.insertAdjacentHTML('beforeend', `
			<div class="input-group">
				<input name="data.modifiers[].value" type="number" value=""/>
				<select name="data.modifiers[].type">
					<optgroup label="${game.i18n.localize("common.attributes")}">
						<option value="str">${game.i18n.localize("common.str.code")}</option>
						<option value="dex">${game.i18n.localize("common.dex.code")}</option>
						<option value="con">${game.i18n.localize("common.con.code")}</option>
						<option value="int">${game.i18n.localize("common.int.code")}</option>
						<option value="wis">${game.i18n.localize("common.wis.code")}</option>
						<option value="cha">${game.i18n.localize("common.cha.code")}</option>
					</optgroup>
					<optgroup label="${game.i18n.localize("common.archetypes")}">
						<option value="fig">${game.i18n.localize("common.fig.code")}</option>
						<option value="rog">${game.i18n.localize("common.rog.code")}</option>
						<option value="exp">${game.i18n.localize("common.exp.code")}</option>
						<option value="sag">${game.i18n.localize("common.sag.code")}</option>
						<option value="art">${game.i18n.localize("common.art.code")}</option>
						<option value="dip">${game.i18n.localize("common.dip.code")}</option>
					</optgroup>
					<optgroup label="${game.i18n.localize("common.miscellaneous")}">
						<option value="res">${game.i18n.localize("common.res.code")}</option>
					</optgroup>
					</select>
				<div class="input-group-append">
					<button type="button" data-action="move-modifier-up"><i class="fa fa-arrow-up"></i></button>
					<button type="button" data-action="move-modifier-down"><i class="fa fa-arrow-down"></i></button>
					<button type="button" data-action="delete-modifier"><i class="fas fa-trash"></i></button>
				</div>
			</div>
      	`);
	}

	_onEditIcon(e) {
		new FilePicker({
			type: "image",
			current: this.item.img,
			callback: path => {
				e.currentTarget.src = path;
				e.currentTarget.closest(".image__icon").querySelector("input[type='hidden']").value = path;
			},
			top: this.position.top + 40,
			left: this.position.left + 10
		}).browse(this.item.img);
	}

	static async editItemDialog({
		item
	} = {}) {
		return new Promise((resolve, reject) => {
			const dlg = new this(item, {
				title: `Edit | ${item.name}`,
				buttons: {
					cancel: {
						icon: '<i class="fas fa-times"></i>',
						label: "Cancel",
						callback: reject
					},
					save: {
						icon: '<i class="fas fa-save"></i>',
						label: "Save",
						class: "btn-primary btn-save",
						callback: html => {
							let form = html.find("#edit-item")[0];
							let output = {
								"name": form.querySelector("[name='name']").value,
								"img": form.querySelector("[name='img']").value,
								"data.rarity": form.querySelector("[name='data.rarity']").value,
								"data.canBeEquipped": form.querySelector("[name='data.canBeEquipped']").checked,
								"data.canHaveCharges": form.querySelector("[name='data.canHaveCharges']").checked,
								"data.charges": form.querySelector("[name='data.charges']").value,
								"data.canHaveBulk": form.querySelector("[name='data.canHaveBulk']").checked,
								"data.bulk": form.querySelector("[name='data.bulk']").value,
								"data.canHaveValue": form.querySelector("[name='data.canHaveValue']").checked,
								"data.value": form.querySelector("[name='data.value']").value,
								"data.descriptions.simple": form.querySelector("[name='data.descriptions.simple']").value,
								"data.descriptions.simpleFlavor": form.querySelector("[name='data.descriptions.simpleFlavor']").value,
								"data.descriptions.expanded": form.querySelector("[name='data.descriptions.expanded']").value,
								"data.descriptions.expandedFlavor": form.querySelector("[name='data.descriptions.expandedFlavor']").value,
								"data.tags": [],
								"data.modifiers": []
							};
							form.querySelectorAll(".tags [name='data.tags[]']").forEach(function(element) {
								if (element.value && element.value.trim() != "") {
									output["data.tags"].push(element.value.trim());
								}
							});
							form.querySelectorAll(".modifiers > div").forEach(function(row) {
								let modifier = row.querySelector("[name='data.modifiers[].value']").value;
								let type = row.querySelector("[name='data.modifiers[].type']").value;
								if (modifier != "" && type != "") {
									output["data.modifiers"].push({
										"value": modifier,
										"type": type
									});
								}
							});
							resolve(output);
						}
					}
				},
				close: reject
			});
			dlg.render(true);
		});
	}
}