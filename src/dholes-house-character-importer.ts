// Import TypeScript modules
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import ImportWindow from "./module/importWindow.js";

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function() {
	console.log('dholes-house-character-importer | Initializing dholes-house-character-importer');

	// Assign custom classes and constants here
	
	// Register custom module settings
	registerSettings();
	
	// Preload Handlebars templates
	await preloadTemplates();

	// Register custom sheets (if any)
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function() {
	// Do anything after initialization but before
	// ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function() {
	// Do anything once the module is ready
});

// Add any additional hooks if necessary
Hooks.on("renderSidebarTab", async (app, html) => {
	if (app?.options?.id == "actors") {
			let button = $("<button class='import-character'><i class='fas fa-file-import'></i>Dhole's House Character Import</button>");
			button.on('click', ()=> {
					new ImportWindow().render(true);
			});
			html.find(".directory-footer").append(button);
	}
})

Hooks.on("renderActorSheet", (sheet)=>{
	console.log(sheet);
})