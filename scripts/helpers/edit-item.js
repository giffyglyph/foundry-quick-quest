export default class EditItem {

	static _onClickTags(e) {
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

	static _onAddTag(html) {
        let tags = html.find('.tags')[0];
		tags.insertAdjacentHTML('beforeend', `
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

	static _onClickModifiers(e) {
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

	static _onAddModifier(html) {
        let modifiers = html.find('.modifiers')[0];
		modifiers.insertAdjacentHTML('beforeend', `
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

	static _onEditIcon(e) {
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

    static _getTags(html) {
        let tags = [];
        html.querySelectorAll(".tags [name='data.tags[]']").forEach(function(element) {
            if (element.value && element.value.trim() != "") {
                tags.push(element.value.trim());
            }
        });
        return tags;
    }

    static _getModifiers(html) {
        let modifiers = [];
        html.querySelectorAll(".modifiers > div").forEach(function(row) {
            let modifier = row.querySelector("[name='data.modifiers[].value']").value;
            let type = row.querySelector("[name='data.modifiers[].type']").value;
            if (modifier != "" && type != "") {
                modifiers.push({
                    "value": modifier,
                    "type": type
                });
            }
        });
        return modifiers;
    }
}