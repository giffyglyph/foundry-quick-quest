import EditItem from "../helpers/edit-item.js";

export default class EditPerkDialog extends Dialog {

	constructor(item, dialogData = {}, options = {}) {
		super(dialogData, options);
		this.item = item;
	}

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			template: "systems/quickquest/templates/dialogs/edit-perk.html",
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
		html.find('[data-action="set-icon"]').click(ev => EditItem._onEditIcon(ev, this.item.img));
		html.find('[data-action="add-tag"]').click(ev => EditItem._onAddTag(html));
		html.find('[data-action="add-modifier"]').click(ev => EditItem._onAddModifier(html));
		html.find('.tags').click(ev => EditItem._onClickTags(ev));
		html.find('.modifiers').click(ev => EditItem._onClickModifiers(ev));
		const tabs = new Tabs({
			navSelector: ".dialog__tabs__nav",
			contentSelector: ".dialog__tabs__body",
			initial: "core",
			callback: function() {}
		});
		tabs.bind(html[0]);
	}

	static async editPerkDialog({ item } = {}) {
		return new Promise((resolve, reject) => {
			const dlg = new this(item, {
				title: `Edit | ${item.name}`,
				buttons: {
					cancel: {
						icon: '<i class="fas fa-times"></i>',
						label: game.i18n.format('common.cancel'),
						callback: reject
					},
					save: {
						icon: '<i class="fas fa-save"></i>',
						label: game.i18n.format('common.save'),
						class: "btn-primary btn-save",
						callback: html => {
							let form = html.find("#edit-perk")[0];
							let output = {
								"name": form.querySelector("[name='name']").value,
								"img": form.querySelector("[name='img']").value,
								"data.rarity": form.querySelector("[name='data.rarity']").value,
								"data.descriptions.primary.main": form.querySelector("[name='data.descriptions.primary.main']").value,
								"data.descriptions.primary.flavor": form.querySelector("[name='data.descriptions.primary.flavor']").value,
								"data.descriptions.secondary.main": form.querySelector("[name='data.descriptions.secondary.main']").value,
								"data.descriptions.secondary.flavor": form.querySelector("[name='data.descriptions.secondary.flavor']").value,
								"data.tags": EditItem._getTags(form),
								"data.modifiers": EditItem._getModifiers(form)
							};
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