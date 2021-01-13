export const preloadTemplates = async function() {
	const templatePaths = [
		"modules/dholes-house-character-importer/templates/importer.html"
	];

	return loadTemplates(templatePaths);
}
