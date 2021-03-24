/**
 * Extend the base Actor class to implement additional system-specific logic.
 */
export default class ActorEntity extends Actor {

    /** @override */
	prepareData() {
		super.prepareData();
        const actor = this.data;

		// Process items
		this._validateItems(actor.items);

		// Get item categories
		actor.data.resources = this._getResources(actor.items.filter((x) => x.type == "resource"));
		actor.data.perks = this._getPerks(actor.items.filter((x) => x.type == "perk"));

		// Get modifiers and apply to aspects
		let modifiers = this._getItemModifiers(actor.items);
		["str", "dex", "con", "int", "wis", "cha"].forEach((x) => this._applyAttributeModifier(actor, x, modifiers[x]));
		["fig", "rog", "exp", "sag", "art", "dip"].forEach((x) => this._applyArchetypeModifier(actor, x, modifiers[x]));
		this._applyResolveModifier(actor, modifiers["res"]);
	}

	_getResources(items) {
		let resources = {
			items: items,
			totalVisible: 0,
			totalHidden: 0,
			totalEquipped: 0,
			totalBulk: 0,
			totalValue: 0
		};
		items.forEach(function(item) {
			if (item.data.isHidden) {
				resources.totalHidden++;
			} else {
				resources.totalVisible++;
				if (item.data.canBeEquipped && item.data.isEquipped) {
					resources.totalEquipped++;
				}
				if (item.data.canHaveBulk) {
					resources.totalBulk += Number(item.data.bulk);
				}
				if (item.data.canHaveValue) {
					resources.totalValue += Number(item.data.value);
				}
			}
		});
		return resources;
	}

	_getPerks(items) {
		let perks = {
			items: items,
			totalVisible: 0,
			totalHidden: 0
		};
		items.forEach(function(item) {
			if (item.data.isHidden) {
				perks.totalHidden++;
			} else {
				perks.totalVisible++;
			}
		});
		return perks;
	}

	_validateItems(items) {
		items.forEach(function(item) {
			switch (item.type) {
				case "resource":
					if (item.data.canHaveBulk && !item.data.bulk) {
						item.data.bulk = 0;
					}
					if (item.data.canHaveValue && !item.data.value) {
						item.data.value = 0;
					}
					if (item.data.canHaveCharges && !item.data.charges) {
						item.data.charges = 0;
					}
					break;
			}
		});
	}

	_getItemModifiers(items) {
		let modifiers = {};
		items.filter(x => !x.data.isHidden && (x.type != "resource" || x.type == "resource" && x.data.canBeEquipped && x.data.isEquipped)).forEach(function(item) {
			item.data.modifiers.forEach(function(modifier) {
				if (!modifiers[modifier.type]) {
					modifiers[modifier.type] = {
						total: 0,
						sources: []
					};
				}
				modifiers[modifier.type].total += Number(modifier.value);
				modifiers[modifier.type].sources.push({
					value: (modifier.value > 0 ? `+${modifier.value}` : modifier.value),
					source: item.name
				});
			});
		});
		return modifiers;
	}

	_applyAttributeModifier(actor, attribute, modifier) {
		if (!actor.data.attributes[attribute].modifier) {
			actor.data.attributes[attribute].modifier = 0;
		}
		if (!actor.data.attributes[attribute].sources) {
			actor.data.attributes[attribute].sources = [{
				value: (actor.data.attributes[attribute].base > 0 ? `+${actor.data.attributes[attribute].base}` : actor.data.attributes[attribute].base),
				source: `base`
			}];
		}
		if (modifier) {
			actor.data.attributes[attribute].modifier = modifier.total;
			actor.data.attributes[attribute].sources = actor.data.attributes[attribute].sources.concat(modifier.sources);
		}
		actor.data.attributes[attribute].total = actor.data.attributes[attribute].base + actor.data.attributes[attribute].modifier;
		actor.data.attributes[attribute].class = (actor.data.attributes[attribute].modifier == 0) ? "neutral" : (actor.data.attributes[attribute].modifier > 0) ? "higher" : "lower";
	}

	_applyArchetypeModifier(actor, archetype, modifier) {
		if (!actor.data.archetypes[archetype].modifier) {
			actor.data.archetypes[archetype].modifier = 0;
		}
		if (!actor.data.archetypes[archetype].sources) {
			actor.data.archetypes[archetype].sources = [{
				value: (actor.data.archetypes[archetype].base > 0 ? `+${actor.data.archetypes[archetype].base}` : actor.data.archetypes[archetype].base),
				source: `base`
			}];
		}
		if (modifier) {
			actor.data.archetypes[archetype].modifier = modifier.total;
			actor.data.archetypes[archetype].sources = actor.data.archetypes[archetype].sources.concat(modifier.sources);
		}
		actor.data.archetypes[archetype].total = actor.data.archetypes[archetype].base + actor.data.archetypes[archetype].modifier;
		actor.data.archetypes[archetype].class = (actor.data.archetypes[archetype].modifier == 0) ? "neutral" : (actor.data.archetypes[archetype].modifier > 0) ? "higher" : "lower";
	}

	_applyResolveModifier(actor, modifier) {
		if (!actor.data.resolve.maximum.modifier) {
			actor.data.resolve.maximum.modifier = 0;
		}
		if (!actor.data.resolve.maximum.sources) {
			actor.data.resolve.maximum.sources = [{
				value: (actor.data.resolve.maximum.base > 0 ? `+${actor.data.resolve.maximum.base}` : actor.data.resolve.maximum.base),
				source: `base`
			}];
		}
		if (modifier) {
			actor.data.resolve.maximum.modifier = modifier.total;
			actor.data.resolve.maximum.sources = actor.data.resolve.maximum.sources.concat(modifier.sources);
		}
		actor.data.resolve.maximum.total = actor.data.resolve.maximum.base + actor.data.resolve.maximum.modifier;
        actor.data.resolve.maximum.class = (actor.data.resolve.maximum.modifier == 0) ? "neutral" : (actor.data.resolve.maximum.modifier > 0) ? "higher" : "lower";
	}
}
