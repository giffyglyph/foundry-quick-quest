import { preloadHandlebarsTemplates } from "./scripts/templates/templates.js";

import ActorSheetCharacter from './scripts/sheets/character.js';
import ItemSheetItem from './scripts/sheets/item.js';
import ActorEntity from './scripts/entities/actor.js';
import ItemEntity from './scripts/entities/item.js';

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
	console.log(`Giffyglyph's Quick Quest | Initialising`);

	CONFIG.Actor.entityClass = ActorEntity;
  	CONFIG.Item.entityClass = ItemEntity;

	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("gqq", ActorSheetCharacter, {
		types: ["character"],
		makeDefault: true,
		label: "sheet.character.label"
	});
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("gqq", ItemSheetItem, {
		makeDefault: true,
		label: "sheet.item.label"
	});

	// Register handlebars helpers
	Handlebars.registerHelper('concat', function(...args) {
		return args.slice(0, -1).join('');
	});
	Handlebars.registerHelper('strlen', function(str) {
		return String(str).length;
	});

	preloadHandlebarsTemplates();

  console.log(`Giffyglyph's Quick Quest | Initialised`);
});