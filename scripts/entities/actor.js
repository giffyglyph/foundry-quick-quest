/**
 * Extend the base Actor class to implement additional system-specific logic.
 */
export default class ActorEntity extends Actor {

    /** @override */
	prepareData() {
		super.prepareData();
        const actor = this.data;
		let itemStats = this._getItemStatistics(actor.items);
		["str", "dex", "con", "int", "wis", "cha"].forEach(x => this._applyAttributeModifier(actor, x, itemStats.modifiers[x]));
		["fig", "rog", "exp", "sag", "art", "dip"].forEach(x => this._applyArchetypeModifier(actor, x, itemStats.modifiers[x]));
		this._applyResolveModifier(actor, itemStats.modifiers["res"]);
        actor.data.resolve.maximum.total = actor.data.resolve.maximum.base + actor.data.resolve.maximum.modifier;
        actor.data.resolve.maximum.class = (actor.data.resolve.maximum.modifier == 0) ? "neutral" : (actor.data.resolve.maximum.modifier > 0) ? "higher" : "lower";
		actor.data.totalInventoryBulk = itemStats.totals["bulk"];
		actor.data.totalInventoryValue = itemStats.totals["value"];
		actor.data.totalInventoryCount = actor.items.length;
		actor.data.totalInventoryEquipped = itemStats.totals["equipped"];
		actor.data.totalInventoryVisible = itemStats.totals["visible"];
		actor.data.totalInventoryHidden = itemStats.totals["hidden"];
	}

	_getItemStatistics(items) {
		let stats = {
			modifiers: {},
			totals: {
				visible: 0,
				hidden: 0,
				equipped: 0,
				bulk: 0,
				value: 0
			}
		};
		items.forEach(function(item) {
			if (item.data.isHidden) {
				stats.totals["hidden"] += 1;
			} else {
				stats.totals["visible"] += 1;
				if (item.data.canBeEquipped && item.data.isEquipped) {
					stats.totals["equipped"] += 1;
					item.data.modifiers.forEach(function(modifier) {
						if (!stats.modifiers[modifier.type]) {
							stats.modifiers[modifier.type] = {
								total: 0,
								sources: []
							};
						}
						stats.modifiers[modifier.type].total += Number(modifier.value);
						stats.modifiers[modifier.type].sources.push(`${modifier.value > 0 ? `+${modifier.value}` : modifier.value} from ${item.name}`);
					});
				}
				if (item.data.canHaveBulk) {
					stats.totals["bulk"] += Number(item.data.bulk);
				}
				if (item.data.canHaveValue) {
					stats.totals["value"] += Number(item.data.value);
				}
			}
		});
		return stats;
	}

	_applyAttributeModifier(actor, attribute, modifier) {
		if (!actor.data.attributes[attribute].modifier) {
			actor.data.attributes[attribute].modifier = 0;
		}
		if (!actor.data.attributes[attribute].sources) {
			actor.data.attributes[attribute].sources = [
				`${actor.data.attributes[attribute].base > 0 ? `+${actor.data.attributes[attribute].base}` : actor.data.attributes[attribute].base} from base`
			];
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
			actor.data.archetypes[archetype].sources = [
				`${actor.data.archetypes[archetype].base > 0 ? `+${actor.data.archetypes[archetype].base}` : actor.data.archetypes[archetype].base} from base`
			];
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
			actor.data.resolve.maximum.sources = [
				`${actor.data.resolve.maximum.base > 0 ? `+${actor.data.resolve.maximum.base}` : actor.data.resolve.maximum.base} from base`
			];
		}
		if (modifier) {
			actor.data.resolve.maximum.modifier = modifier.total;
			actor.data.resolve.maximum.sources = actor.data.resolve.maximum.sources.concat(modifier.sources);
		}
	}
}
