export default class CharacterRollDialog extends Dialog {

	constructor(actor, dialogData = {}, options = {}) {
		super(dialogData, options);
        this.actor = actor;
	}

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			template: "systems/quickquest/templates/dialogs/character-roll.html",
			classes: ["window-gqq"],
			width: 450,
			height: 545,
			resizable: false
		});
	}

    /** @override */
	getData() {
		const data = super.getData();
		data.preselectStr = (this.data.preselectedAttribute == "str");
        data.preselectDex = (this.data.preselectedAttribute == "dex");
        data.preselectCon = (this.data.preselectedAttribute == "con");
        data.preselectInt = (this.data.preselectedAttribute == "int");
        data.preselectWis = (this.data.preselectedAttribute == "wis");
        data.preselectCha = (this.data.preselectedAttribute == "cha");
        data.preselectFig = (this.data.preselectedAttribute == "fig");
        data.preselectRog = (this.data.preselectedAttribute == "rog");
        data.preselectExp = (this.data.preselectedAttribute == "exp");
        data.preselectSag = (this.data.preselectedAttribute == "sag");
        data.preselectArt = (this.data.preselectedAttribute == "art");
        data.preselectDip = (this.data.preselectedAttribute == "dip");
		return data;
	}

    /** @override */
	activateListeners(html) {
		super.activateListeners(html);
		html.find('.attribute').click(ev => this._onClickAttribute(ev));
	}

    _onClickAttribute(e) {
        e.target.closest(".attributes").querySelectorAll(".attribute").forEach(el => el.classList.remove("active"));
        e.target.closest(".attribute").classList.add("active");
		e.target.closest(".attribute").querySelector("input[type='radio']").checked = true;
	}

	static async characterRollDialog({
		actor, preselectedAttribute
	} = {}) {
		function _getFormData(html, advantage) {
			let form = html.find("#character-roll")[0];
			return {
				"attribute": form.querySelector("[name='attribute']:checked") ? form.querySelector("[name='attribute']:checked").value : null,
				"archetype": form.querySelector("[name='archetype']:checked") ? form.querySelector("[name='archetype']:checked").value : null,
				"advantage": advantage,
				"bonus": form.querySelector("[name='bonus']").value,
				"mode": form.querySelector("[name='mode']").value
			};
		}
		return new Promise((resolve, reject) => {
			const dlg = new this(actor, {
				title: `Make a Roll`,
                preselectedAttribute: preselectedAttribute,
				buttons: {
                    advantage: {
						icon: '<i class="fas fa-plus"></i>',
						label: game.i18n.format('common.advantage'),
						class: "btn-advantage",
						callback: (html) => resolve(_getFormData(html, "advantage"))
					},
					roll: {
						icon: '<i class="fas fa-dice-d20"></i>',
						label: game.i18n.format('common.roll'),
						class: "btn-primary btn-roll",
						callback: (html) => resolve(_getFormData(html, "normal"))
					},
					disadvantage: {
						icon: '<i class="fas fa-minus"></i>',
						label: game.i18n.format('common.disadvantage'),
						class: "btn-disadvantage",
						callback: (html) => resolve(_getFormData(html, "disadvantage"))
					},				
				},
				close: reject
			});
			dlg.render(true);
		});
		
	}
}